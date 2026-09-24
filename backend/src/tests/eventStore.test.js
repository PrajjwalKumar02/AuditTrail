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
} = require("../events/services/eventStore");

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
});
