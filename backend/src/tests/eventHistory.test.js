jest.mock("../events/eventStore", () => ({
  getEventsByAggregate: jest.fn(),
}));

const {
  getEventsByAggregate,
} = require("../events/eventStore");

const {
  getAggregateEventHistory,
} = require("../aggregates/eventHistory");

describe("Event History", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return complete aggregate event history", async () => {
    const events = [
      {
        aggregateId: "CNT-001",
        aggregateType: "Container",
        eventType: "CONTAINER_CREATED",
        payload: {
          location: "Warehouse-A",
        },
        version: 1,
        timestamp: new Date("2026-09-08T10:00:00.000Z"),
        previousHash: null,
        hash: "hash-v1",
      },
      {
        aggregateId: "CNT-001",
        aggregateType: "Container",
        eventType: "LOADED_ON_SHIP",
        payload: {
          ship: "MSC-001",
        },
        version: 2,
        timestamp: new Date("2026-09-08T11:00:00.000Z"),
        previousHash: "hash-v1",
        hash: "hash-v2",
      },
    ];

    getEventsByAggregate.mockResolvedValue(events);

    const result = await getAggregateEventHistory("CNT-001");

    expect(getEventsByAggregate).toHaveBeenCalledWith("CNT-001");
    expect(result).toHaveLength(2);

    expect(result[0]).toMatchObject({
      aggregateId: "CNT-001",
      eventType: "CONTAINER_CREATED",
      version: 1,
      hash: "hash-v1",
    });

    expect(result[1]).toMatchObject({
      aggregateId: "CNT-001",
      eventType: "LOADED_ON_SHIP",
      version: 2,
      hash: "hash-v2",
    });
  });

  test("should return an empty history when no events exist", async () => {
    getEventsByAggregate.mockResolvedValue([]);

    const result = await getAggregateEventHistory("CNT-001");

    expect(result).toEqual([]);
  });

  test("should reject when aggregate ID is missing", async () => {
    await expect(
      getAggregateEventHistory()
    ).rejects.toThrow("Aggregate ID is required");

    expect(getEventsByAggregate).not.toHaveBeenCalled();
  });
});