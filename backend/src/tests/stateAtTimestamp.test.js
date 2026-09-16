jest.mock("../events/services/eventStore", () => ({
  getEventsForAggregate: jest.fn(),
}));

jest.mock("../utils/logger", () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
}));

const {
  replayUpToTimestamp,
  reconstructHistoricalState,
} = require("../aggregates/container/containerAggregate");

const {
  getEventsForAggregate,
} = require("../events/services/eventStore");

describe("State At Timestamp", () => {
  const events = [
    {
      aggregateId: "CNT-001",
      eventType: "CONTAINER_CREATED",
      payload: {
        location: "Warehouse-A",
      },
      version: 1,
      timestamp: "2026-09-16T10:00:00.000Z",
    },
    {
      aggregateId: "CNT-001",
      eventType: "LOADED_ON_SHIP",
      payload: {
        ship: "MSC-001",
      },
      version: 2,
      timestamp: "2026-09-16T11:00:00.000Z",
    },
    {
      aggregateId: "CNT-001",
      eventType: "MOVED",
      payload: {
        location: "Mumbai Port",
      },
      version: 3,
      timestamp: "2026-09-16T12:00:00.000Z",
    },
    {
      aggregateId: "CNT-001",
      eventType: "ARRIVED_AT_PORT",
      payload: {
        location: "Mumbai Port",
      },
      version: 4,
      timestamp: "2026-09-16T13:00:00.000Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should calculate state at an intermediate timestamp", () => {
    const result = replayUpToTimestamp(
      events,
      "2026-09-16T11:30:00.000Z"
    );

    expect(result).toMatchObject({
      status: "LOADED",
      location: "Warehouse-A",
      ship: "MSC-001",
      version: 2,
    });
  });

  test("should include an event occurring exactly at the requested timestamp", () => {
    const result = replayUpToTimestamp(
      events,
      "2026-09-16T12:00:00.000Z"
    );

    expect(result).toMatchObject({
      status: "IN_TRANSIT",
      location: "Mumbai Port",
      ship: "MSC-001",
      version: 3,
    });
  });

  test("should exclude events occurring after the requested timestamp", () => {
    const result = replayUpToTimestamp(
      events,
      "2026-09-16T10:30:00.000Z"
    );

    expect(result).toMatchObject({
      status: "CREATED",
      location: "Warehouse-A",
      ship: null,
      version: 1,
    });
  });

  test("should return initial state when timestamp is before all events", () => {
    const result = replayUpToTimestamp(
      events,
      "2026-09-16T09:00:00.000Z"
    );

    expect(result).toMatchObject({
      status: "CREATED",
      location: null,
      ship: null,
      version: 0,
    });
  });

  test("should reconstruct historical state from Event Store at a timestamp", async () => {
    getEventsForAggregate.mockResolvedValue(events);

    const result = await reconstructHistoricalState(
      "CNT-001",
      "2026-09-16T11:30:00.000Z"
    );

    expect(getEventsForAggregate).toHaveBeenCalledWith("CNT-001");

    expect(result).toMatchObject({
      status: "LOADED",
      location: "Warehouse-A",
      ship: "MSC-001",
      version: 2,
    });
  });

  test("should return null when no events exist", async () => {
    getEventsForAggregate.mockResolvedValue([]);

    const result = await reconstructHistoricalState(
      "CNT-002",
      "2026-09-16T11:30:00.000Z"
    );

    expect(result).toBeNull();
  });
});
