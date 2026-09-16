jest.mock("../events/services/eventStore", () => ({
  getEventsForAggregate: jest.fn(),
}));

jest.mock("../utils/logger", () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
}));

const {
  replayUpToVersion,
} = require("../aggregates/container/containerAggregate");

describe("Historical State Calculation", () => {
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

  test("should calculate state at an intermediate version", () => {
    const result = replayUpToVersion(events, 2);

    expect(result).toMatchObject({
      id: null,
      status: "LOADED",
      location: "Warehouse-A",
      ship: "MSC-001",
      version: 2,
    });
  });

  test("should calculate state at the latest version", () => {
    const result = replayUpToVersion(events, 4);

    expect(result).toMatchObject({
      status: "ARRIVED",
      location: "Mumbai Port",
      ship: "MSC-001",
      version: 4,
    });
  });

  test("should exclude events after the requested version", () => {
    const result = replayUpToVersion(events, 1);

    expect(result).toMatchObject({
      status: "CREATED",
      location: "Warehouse-A",
      ship: null,
      version: 1,
    });
  });

  test("should return initial state when requested version is before all events", () => {
    const result = replayUpToVersion(events, 0);

    expect(result).toMatchObject({
      status: "CREATED",
      location: null,
      ship: null,
      version: 0,
    });
  });

  test("should calculate historical state from unordered events", () => {
    const unorderedEvents = [
      events[2],
      events[0],
      events[3],
      events[1],
    ];

    const result = replayUpToVersion(unorderedEvents, 2);

    expect(result).toMatchObject({
      status: "LOADED",
      location: "Warehouse-A",
      ship: "MSC-001",
      version: 2,
    });
  });
});
