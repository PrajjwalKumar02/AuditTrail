jest.mock("../events/Event", () => {
  const Event = jest.fn();

  Event.findOne = jest.fn();
  Event.find = jest.fn();

  return Event;
});

const Event = require("../events/Event");

const {
  appendEvent,
  getEventsByAggregate,
  verifyEventIntegrity,
  verifyEventChain,
} = require("../events/eventStore");

const { generateHash } = require("../utils/crypto");

describe("Event Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should append an event with SHA-256 hash", async () => {
    const eventData = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerCreated",
      payload: { status: "created" },
      version: 1,
      timestamp: new Date("2026-09-08T10:00:00.000Z"),
    };

    Event.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue(null),
    });

    const savedEvent = {
      ...eventData,
      previousHash: null,
      hash: "generated-hash",
    };

    Event.mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(savedEvent),
    }));

    const result = await appendEvent(eventData);

    expect(Event.findOne).toHaveBeenCalledWith({
      aggregateId: "container-001",
    });

    expect(result.hash).toBe("generated-hash");
    expect(result.previousHash).toBeNull();
  });

  test("should link a new event to the previous event hash", async () => {
    const previousEvent = {
      aggregateId: "container-001",
      version: 1,
      hash: "previous-event-hash",
    };

    Event.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue(previousEvent),
    });

    const savedEvent = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerUpdated",
      payload: {
        status: "updated",
      },
      version: 2,
      previousHash: "previous-event-hash",
      hash: "new-event-hash",
    };

    Event.mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(savedEvent),
    }));

    const eventData = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerUpdated",
      payload: {
        status: "updated",
      },
      version: 2,
      timestamp: new Date("2026-09-08T10:01:00.000Z"),
    };

    const result = await appendEvent(eventData);

    expect(Event.findOne).toHaveBeenCalledWith({
      aggregateId: "container-001",
    });

    expect(Event).toHaveBeenCalledWith(
      expect.objectContaining({
        previousHash: "previous-event-hash",
      })
    );

    expect(result.previousHash).toBe("previous-event-hash");
  });

  test("should retrieve events in version order", async () => {
    const events = [
      {
        aggregateId: "container-001",
        version: 1,
      },
      {
        aggregateId: "container-001",
        version: 2,
      },
    ];

    const sortMock = jest.fn().mockResolvedValue(events);

    Event.find.mockReturnValue({
      sort: sortMock,
    });

    const result = await getEventsByAggregate("container-001");

    expect(Event.find).toHaveBeenCalledWith({
      aggregateId: "container-001",
    });

    expect(sortMock).toHaveBeenCalledWith({
      version: 1,
    });

    expect(result).toEqual(events);
  });

  test("should verify an untampered event", () => {
    const event = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerCreated",
      payload: {
        status: "created",
      },
      version: 1,
      timestamp: new Date("2026-09-08T10:00:00.000Z"),
      previousHash: null,
    };

    const hashData = {
      aggregateId: event.aggregateId,
      aggregateType: event.aggregateType,
      eventType: event.eventType,
      payload: event.payload,
      version: event.version,
      timestamp: event.timestamp,
      previousHash: event.previousHash,
    };

    event.hash = generateHash(hashData);

    expect(verifyEventIntegrity(event)).toBe(true);
  });

  test("should reject a tampered event", () => {
    const event = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerCreated",
      payload: {
        status: "created",
      },
      version: 1,
      timestamp: new Date("2026-09-08T10:00:00.000Z"),
      previousHash: null,
    };

    const hashData = {
      aggregateId: event.aggregateId,
      aggregateType: event.aggregateType,
      eventType: event.eventType,
      payload: event.payload,
      version: event.version,
      timestamp: event.timestamp,
      previousHash: event.previousHash,
    };

    event.hash = generateHash(hashData);

    event.payload.status = "tampered";

    expect(verifyEventIntegrity(event)).toBe(false);
  });

  test("should verify a valid event chain", async () => {
    const firstEvent = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerCreated",
      payload: {
        status: "created",
      },
      version: 1,
      timestamp: new Date("2026-09-08T10:00:00.000Z"),
      previousHash: null,
    };

    const firstHashData = {
      aggregateId: firstEvent.aggregateId,
      aggregateType: firstEvent.aggregateType,
      eventType: firstEvent.eventType,
      payload: firstEvent.payload,
      version: firstEvent.version,
      timestamp: firstEvent.timestamp,
      previousHash: firstEvent.previousHash,
    };

    firstEvent.hash = generateHash(firstHashData);

    const secondEvent = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerUpdated",
      payload: {
        status: "updated",
      },
      version: 2,
      timestamp: new Date("2026-09-08T10:01:00.000Z"),
      previousHash: firstEvent.hash,
    };

    const secondHashData = {
      aggregateId: secondEvent.aggregateId,
      aggregateType: secondEvent.aggregateType,
      eventType: secondEvent.eventType,
      payload: secondEvent.payload,
      version: 2,
      timestamp: secondEvent.timestamp,
      previousHash: secondEvent.previousHash,
    };

    secondEvent.hash = generateHash(secondHashData);

    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        firstEvent,
        secondEvent,
      ]),
    });

    const result = await verifyEventChain("container-001");

    expect(result).toBe(true);
  });

  test("should reject a broken event chain", async () => {
    const firstEvent = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerCreated",
      payload: {
        status: "created",
      },
      version: 1,
      timestamp: new Date("2026-09-08T10:00:00.000Z"),
      previousHash: null,
    };

    const firstHashData = {
      aggregateId: firstEvent.aggregateId,
      aggregateType: firstEvent.aggregateType,
      eventType: firstEvent.eventType,
      payload: firstEvent.payload,
      version: firstEvent.version,
      timestamp: firstEvent.timestamp,
      previousHash: firstEvent.previousHash,
    };

    firstEvent.hash = generateHash(firstHashData);

    const secondEvent = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerUpdated",
      payload: {
        status: "updated",
      },
      version: 2,
      timestamp: new Date("2026-09-08T10:01:00.000Z"),
      previousHash: "incorrect-previous-hash",
      hash: "some-hash",
    };

    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        firstEvent,
        secondEvent,
      ]),
    });

    const result = await verifyEventChain("container-001");

    expect(result).toBe(false);
  });

  test("should reject an event chain with a version gap", async () => {
    const firstEvent = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerCreated",
      payload: {
        status: "created",
      },
      version: 1,
      timestamp: new Date("2026-09-08T10:00:00.000Z"),
      previousHash: null,
    };

    const firstHashData = {
      aggregateId: firstEvent.aggregateId,
      aggregateType: firstEvent.aggregateType,
      eventType: firstEvent.eventType,
      payload: firstEvent.payload,
      version: firstEvent.version,
      timestamp: firstEvent.timestamp,
      previousHash: firstEvent.previousHash,
    };

    firstEvent.hash = generateHash(firstHashData);

    const thirdEvent = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerMoved",
      payload: {
        location: "Warehouse-B",
      },
      version: 3,
      timestamp: new Date("2026-09-08T10:02:00.000Z"),
      previousHash: firstEvent.hash,
    };

    const thirdHashData = {
      aggregateId: thirdEvent.aggregateId,
      aggregateType: thirdEvent.aggregateType,
      eventType: thirdEvent.eventType,
      payload: thirdEvent.payload,
      version: 3,
      timestamp: thirdEvent.timestamp,
      previousHash: thirdEvent.previousHash,
    };

    thirdEvent.hash = generateHash(thirdHashData);

    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        firstEvent,
        thirdEvent,
      ]),
    });

    const result = await verifyEventChain("container-001");

    expect(result).toBe(false);
  });

  test("should verify an empty event chain", async () => {
    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    const result = await verifyEventChain("container-001");

    expect(result).toBe(true);
  });
});
  test("should keep events from different aggregates independent", async () => {
    const events = [
      {
        aggregateId: "container-001",
        version: 1,
        eventType: "ContainerCreated",
      },
      {
        aggregateId: "container-002",
        version: 1,
        eventType: "ContainerCreated",
      },
    ];

    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(events),
    });

    const result = await getEventsByAggregate("container-001");

    expect(Event.find).toHaveBeenCalledWith({
      aggregateId: "container-001",
    });

    expect(result).toEqual(events);
  });

  test("should retrieve events only for the requested aggregate", async () => {
    const aggregateEvents = [
      {
        aggregateId: "container-002",
        version: 1,
      },
      {
        aggregateId: "container-002",
        version: 2,
      },
    ];

    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(aggregateEvents),
    });

    const result = await getEventsByAggregate("container-002");

    expect(Event.find).toHaveBeenCalledWith({
      aggregateId: "container-002",
    });

    expect(result.every((event) => event.aggregateId === "container-002")).toBe(
      true
    );
  });
    test("should reject an event chain that starts with an invalid version", async () => {
    const invalidEvent = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerCreated",
      payload: {
        status: "created",
      },
      version: 2,
      timestamp: new Date("2026-09-08T10:00:00.000Z"),
      previousHash: null,
    };

    const invalidHashData = {
      aggregateId: invalidEvent.aggregateId,
      aggregateType: invalidEvent.aggregateType,
      eventType: invalidEvent.eventType,
      payload: invalidEvent.payload,
      version: invalidEvent.version,
      timestamp: invalidEvent.timestamp,
      previousHash: invalidEvent.previousHash,
    };

    invalidEvent.hash = generateHash(invalidHashData);

    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([invalidEvent]),
    });

    const result = await verifyEventChain("container-001");

    expect(result).toBe(false);
  });
