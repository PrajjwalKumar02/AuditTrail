jest.mock("../events/models/Event", () => {
  const Event = jest.fn();

  Event.findOne = jest.fn();
  Event.find = jest.fn();

  return Event;
});

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

const Event = require("../events/models/Event");

const {
  appendEvent,
  verifyEventChain,
} = require("../events/services/eventStore");

const {
  generateEventHash,
} = require("../events/services/hash");

describe("Event Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should append a new event with version 1 and initial hash chain", async () => {
    Event.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue(null),
    });

    const savedEvent = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "CONTAINER_CREATED",
      payload: { status: "created" },
      version: 1,
      previousHash: "0".repeat(64),
      currentHash: "a".repeat(64),
    };

    Event.mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(savedEvent),
    }));

    const result = await appendEvent({
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "CONTAINER_CREATED",
      payload: { status: "created" },
    });

    expect(Event.findOne).toHaveBeenCalledWith({
      aggregateId: "container-001",
    });

    expect(Event).toHaveBeenCalledWith(
      expect.objectContaining({
        aggregateId: "container-001",
        aggregateType: "Container",
        eventType: "CONTAINER_CREATED",
        version: 1,
        previousHash: "0".repeat(64),
      })
    );

    expect(result.version).toBe(1);
    expect(result.previousHash).toBe("0".repeat(64));
    expect(result.currentHash).toHaveLength(64);
  });

  test("should link a new event to the previous event hash", async () => {
    const previousEvent = {
      aggregateId: "container-001",
      version: 1,
      currentHash: "a".repeat(64),
    };

    Event.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue(previousEvent),
    });

    const savedEvent = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "MOVED",
      payload: { location: "Mumbai Port" },
      version: 2,
      previousHash: "a".repeat(64),
      currentHash: "b".repeat(64),
    };

    Event.mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(savedEvent),
    }));

    const result = await appendEvent({
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "MOVED",
      payload: { location: "Mumbai Port" },
    });

    expect(Event.findOne).toHaveBeenCalledWith({
      aggregateId: "container-001",
    });

    expect(Event).toHaveBeenCalledWith(
      expect.objectContaining({
        version: 2,
        previousHash: "a".repeat(64),
      })
    );

    expect(result.version).toBe(2);
    expect(result.previousHash).toBe("a".repeat(64));
  });

  test("should verify a valid event hash chain", async () => {
    const event1 = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "CONTAINER_CREATED",
      payload: { status: "created" },
      version: 1,
      timestamp: new Date("2026-09-28T10:00:00.000Z"),
      previousHash: "0".repeat(64),
    };

    event1.currentHash = generateEventHash(event1);

    const event2 = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "MOVED",
      payload: { location: "Mumbai Port" },
      version: 2,
      timestamp: new Date("2026-09-28T11:00:00.000Z"),
      previousHash: event1.currentHash,
    };

    event2.currentHash = generateEventHash(event2);

    Event.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([event1, event2]),
      }),
    });

    const result = await verifyEventChain("container-001");

    expect(result.valid).toBe(true);
    expect(result.totalEvents).toBe(2);
    expect(result.message).toBe("All events verified successfully");
  });

  test("should detect a tampered event hash", async () => {
    const event = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "CONTAINER_CREATED",
      payload: { status: "created" },
      version: 1,
      timestamp: new Date("2026-09-28T10:00:00.000Z"),
      previousHash: "0".repeat(64),
      currentHash: "tampered".padEnd(64, "0"),
    };

    Event.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([event]),
      }),
    });

    const result = await verifyEventChain("container-001");

    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      "Hash verification failed at version 1"
    );
  });

  test("should detect a broken previous hash link", async () => {
    const event1 = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "CONTAINER_CREATED",
      payload: { status: "created" },
      version: 1,
      timestamp: new Date("2026-09-28T10:00:00.000Z"),
      previousHash: "0".repeat(64),
    };

    event1.currentHash = generateEventHash(event1);

    const event2 = {
      aggregateId: "container-001",
      aggregateType: "Container",
      eventType: "MOVED",
      payload: { location: "Mumbai Port" },
      version: 2,
      timestamp: new Date("2026-09-28T11:00:00.000Z"),
      previousHash: "b".repeat(64),
    };

    event2.currentHash = generateEventHash(event2);

    Event.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([event1, event2]),
      }),
    });

    const result = await verifyEventChain("container-001");

    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      "Hash verification failed at version 2"
    );
  });
});
  test("should verify an empty event chain", async () => {
    Event.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      }),
    });

    const result = await verifyEventChain("container-empty");

    expect(result.valid).toBe(true);
    expect(result.message).toBe("No events to verify");
  });