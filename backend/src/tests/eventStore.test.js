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
      timestamp: new Date("2026-09-07T10:00:00.000Z"),
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

  test("should retrieve events in version order", async () => {
    const events = [
      { aggregateId: "container-001", version: 1 },
      { aggregateId: "container-001", version: 2 },
    ];

    const sortMock = jest.fn().mockResolvedValue(events);

    Event.find.mockReturnValue({
      sort: sortMock,
    });

    const result = await getEventsByAggregate("container-001");

    expect(Event.find).toHaveBeenCalledWith({
      aggregateId: "container-001",
    });
    expect(sortMock).toHaveBeenCalledWith({ version: 1 });
    expect(result).toEqual(events);
  });

  test("should verify an untampered event", () => {
    const event = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerCreated",
      payload: { status: "created" },
      version: 1,
      timestamp: new Date("2026-09-07T10:00:00.000Z"),
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
      payload: { status: "created" },
      version: 1,
      timestamp: new Date("2026-09-07T10:00:00.000Z"),
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
      payload: { status: "created" },
      version: 1,
      timestamp: new Date("2026-09-07T10:00:00.000Z"),
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
      payload: { status: "updated" },
      version: 2,
      timestamp: new Date("2026-09-07T10:01:00.000Z"),
      previousHash: firstEvent.hash,
    };

    const secondHashData = {
      aggregateId: secondEvent.aggregateId,
      aggregateType: secondEvent.aggregateType,
      eventType: secondEvent.eventType,
      payload: secondEvent.payload,
      version: secondEvent.version,
      timestamp: secondEvent.timestamp,
      previousHash: secondEvent.previousHash,
    };

    secondEvent.hash = generateHash(secondHashData);

    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([firstEvent, secondEvent]),
    });

    const result = await verifyEventChain("container-001");

    expect(result).toBe(true);
  });

  test("should reject a broken event chain", async () => {
    const firstEvent = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "ContainerCreated",
      payload: { status: "created" },
      version: 1,
      timestamp: new Date("2026-09-07T10:00:00.000Z"),
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
      payload: { status: "updated" },
      version: 2,
      timestamp: new Date("2026-09-07T10:01:00.000Z"),
      previousHash: "incorrect-previous-hash",
      hash: "some-hash",
    };

    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([firstEvent, secondEvent]),
    });

    const result = await verifyEventChain("container-001");

    expect(result).toBe(false);
  });
});