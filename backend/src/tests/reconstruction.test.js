jest.mock("../events/services/eventStore", () => ({
  getEventsByAggregate: jest.fn(),
}));

const {
  getEventsByAggregate,
} = require("../events/services/eventStore");

const {
  reconstructCurrentState,
} = require("../aggregates/reconstruction");

describe("Current State Reconstruction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should reconstruct current container state from stored events", async () => {
    const events = [
      {
        aggregateId: "CNT-001",
        eventType: "CONTAINER_CREATED",
        payload: {
          location: "Warehouse-A",
        },
        version: 1,
        timestamp: new Date("2026-09-08T10:00:00.000Z"),
      },
      {
        aggregateId: "CNT-001",
        eventType: "LOADED_ON_SHIP",
        payload: {
          ship: "MSC-001",
        },
        version: 2,
        timestamp: new Date("2026-09-08T11:00:00.000Z"),
      },
      {
        aggregateId: "CNT-001",
        eventType: "MOVED_TO_PORT",
        payload: {
          location: "Mumbai Port",
        },
        version: 3,
        timestamp: new Date("2026-09-08T12:00:00.000Z"),
      },
      {
        aggregateId: "CNT-001",
        eventType: "ARRIVED_AT_PORT",
        payload: {
          location: "Mumbai Port",
        },
        version: 4,
        timestamp: new Date("2026-09-08T13:00:00.000Z"),
      },
    ];

    getEventsByAggregate.mockResolvedValue(events);

    const result = await reconstructCurrentState("CNT-001");

    expect(getEventsByAggregate).toHaveBeenCalledWith("CNT-001");

    expect(result).toMatchObject({
      aggregateId: "CNT-001",
      status: "ARRIVED",
      location: "Mumbai Port",
      ship: "MSC-001",
      version: 4,
      lastEventType: "ARRIVED_AT_PORT",
    });
  });

  test("should return initial state when no events exist", async () => {
    getEventsByAggregate.mockResolvedValue([]);

    const result = await reconstructCurrentState("CNT-002");

    expect(getEventsByAggregate).toHaveBeenCalledWith("CNT-002");

    expect(result).toMatchObject({
      aggregateId: null,
      status: "CREATED",
      location: null,
      ship: null,
      temperature: null,
      temperatureAlert: false,
      version: 0,
      lastEventType: null,
      lastEventAt: null,
    });
  });

  test("should reconstruct state from a single creation event", async () => {
    getEventsByAggregate.mockResolvedValue([
      {
        aggregateId: "CNT-003",
        eventType: "CONTAINER_CREATED",
        payload: {
          location: "Warehouse-B",
        },
        version: 1,
        timestamp: new Date("2026-09-09T10:00:00.000Z"),
      },
    ]);

    const result = await reconstructCurrentState("CNT-003");

    expect(result).toMatchObject({
      aggregateId: "CNT-003",
      status: "CREATED",
      location: "Warehouse-B",
      version: 1,
      lastEventType: "CONTAINER_CREATED",
    });
  });

  test("should reconstruct correctly when events are stored out of order", async () => {
    getEventsByAggregate.mockResolvedValue([
      {
        aggregateId: "CNT-004",
        eventType: "MOVED_TO_PORT",
        payload: {
          location: "Mumbai Port",
        },
        version: 3,
      },
      {
        aggregateId: "CNT-004",
        eventType: "CONTAINER_CREATED",
        payload: {
          location: "Warehouse-C",
        },
        version: 1,
      },
      {
        aggregateId: "CNT-004",
        eventType: "LOADED_ON_SHIP",
        payload: {
          ship: "MSC-002",
        },
        version: 2,
      },
    ]);

    const result = await reconstructCurrentState("CNT-004");

    expect(result).toMatchObject({
      aggregateId: "CNT-004",
      status: "LOADED",
      location: "Mumbai Port",
      ship: "MSC-002",
      version: 3,
      lastEventType: "MOVED_TO_PORT",
    });
  });

  test("should reject reconstruction when event versions are invalid", async () => {
    getEventsByAggregate.mockResolvedValue([
      {
        aggregateId: "CNT-005",
        eventType: "CONTAINER_CREATED",
        payload: {
          location: "Warehouse-D",
        },
        version: 1,
      },
      {
        aggregateId: "CNT-005",
        eventType: "ARRIVED_AT_PORT",
        payload: {
          location: "Mumbai Port",
        },
        version: 3,
      },
    ]);

    await expect(
      reconstructCurrentState("CNT-005")
    ).rejects.toThrow(
      "Invalid event version sequence: expected 2, received 3"
    );
  });

  test("should propagate Event Store errors", async () => {
    getEventsByAggregate.mockRejectedValue(
      new Error("Event Store unavailable")
    );

    await expect(
      reconstructCurrentState("CNT-006")
    ).rejects.toThrow("Event Store unavailable");
  });

  test("should reject when aggregate ID is missing", async () => {
    await expect(
      reconstructCurrentState()
    ).rejects.toThrow("Aggregate ID is required");

    expect(getEventsByAggregate).not.toHaveBeenCalled();
  });
});
