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

  test("should reject when aggregate ID is missing", async () => {
    await expect(
      reconstructCurrentState()
    ).rejects.toThrow("Aggregate ID is required");

    expect(getEventsByAggregate).not.toHaveBeenCalled();
  });
});
