jest.mock("../snapshots/Snapshot", () => {
  const Snapshot = jest.fn(function Snapshot(data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
  });

  Snapshot.findOne = jest.fn();

  return Snapshot;
});

jest.mock("../events/services/eventStore", () => ({
  getEventsForAggregate: jest.fn(),
}));

jest.mock("../aggregates/container/containerAggregate", () => ({
  replay: jest.fn(),
}));

jest.mock("../utils/logger", () => ({
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}));

const Snapshot = require("../snapshots/Snapshot");

const {
  getEventsForAggregate,
} = require("../events/services/eventStore");

const {
  replay,
} = require("../aggregates/container/containerAggregate");

const logger = require("../utils/logger");

const {
  createSnapshot,
  SNAPSHOT_INTERVAL,
} = require("../snapshots/snapshotService");

describe("Snapshot Creation", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Snapshot.mockImplementation(function Snapshot(data) {
      Object.assign(this, data);
      this.save = jest.fn().mockResolvedValue(this);
    });
  });

  test("should return null when aggregate has no events", async () => {
    getEventsForAggregate.mockResolvedValue([]);

    const result = await createSnapshot("CNT-001");

    expect(result).toBeNull();
    expect(Snapshot.findOne).not.toHaveBeenCalled();
    expect(replay).not.toHaveBeenCalled();
  });

  test("should create a snapshot after the snapshot interval is reached", async () => {
    const events = Array.from({ length: SNAPSHOT_INTERVAL }, (_, index) => ({
      _id: `event-${index + 1}`,
      aggregateId: "CNT-001",
      version: index + 1,
      eventType: index === 0 ? "CONTAINER_CREATED" : "MOVED",
      payload: {
        location: `Location-${index + 1}`,
      },
      timestamp: `2026-09-${String(index + 1).padStart(2, "0")}T10:00:00.000Z`,
    }));

    const replayedState = {
      id: "CNT-001",
      status: "IN_TRANSIT",
      location: "Location-10",
      version: 10,
    };

    getEventsForAggregate.mockResolvedValue(events);

    Snapshot.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue(null),
    });

    replay.mockReturnValue(replayedState);

    const result = await createSnapshot("CNT-001");

    expect(replay).toHaveBeenCalledWith(events);
    expect(result.aggregateId).toBe("CNT-001");
    expect(result.aggregateType).toBe("Container");
    expect(result.state).toEqual(replayedState);
    expect(result.version).toBe(10);
    expect(result.eventCount).toBe(10);
    expect(result.lastEventId).toBe("event-10");
    expect(result.save).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalled();
  });

  test("should preserve a custom aggregate type when creating a snapshot", async () => {
    const events = Array.from({ length: SNAPSHOT_INTERVAL }, (_, index) => ({
      _id: `event-${index + 1}`,
      aggregateId: "SHIP-001",
      version: index + 1,
      eventType: "SHIP_UPDATED",
      payload: {},
      timestamp: "2026-09-10T10:00:00.000Z",
    }));

    getEventsForAggregate.mockResolvedValue(events);

    Snapshot.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue(null),
    });

    replay.mockReturnValue({
      id: "SHIP-001",
      version: 10,
    });

    const result = await createSnapshot("SHIP-001", "Shipment");

    expect(result.aggregateType).toBe("Shipment");
    expect(result.version).toBe(10);
    expect(result.eventCount).toBe(10);
    expect(result.lastEventId).toBe("event-10");
  });

  test("should return the latest snapshot when interval is not reached", async () => {
    const events = Array.from({ length: 5 }, (_, index) => ({
      _id: `event-${index + 1}`,
      aggregateId: "CNT-002",
      version: index + 1,
      eventType: "MOVED",
      payload: {},
      timestamp: "2026-09-10T10:00:00.000Z",
    }));

    const latestSnapshot = {
      aggregateId: "CNT-002",
      version: 2,
    };

    getEventsForAggregate.mockResolvedValue(events);

    Snapshot.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue(latestSnapshot),
    });

    const result = await createSnapshot("CNT-002");

    expect(result).toBe(latestSnapshot);
    expect(replay).not.toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalled();
  });

  test("should handle snapshot creation errors safely", async () => {
    getEventsForAggregate.mockRejectedValue(
      new Error("Event Store unavailable")
    );

    const result = await createSnapshot("CNT-003");

    expect(result).toBeNull();

    expect(logger.error).toHaveBeenCalledWith(
      "Failed to create snapshot: Event Store unavailable"
    );
  });
});