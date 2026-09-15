const {
  replayEvents,
} = require("../aggregates/replay");

describe("Replay Engine", () => {
  test("should validate, order, and replay events into current state", () => {
    const events = [
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
    ];

    const result = replayEvents(events);

    expect(result).toMatchObject({
      aggregateId: "CNT-001",
      status: "LOADED",
      location: "Mumbai Port",
      ship: "MSC-001",
      version: 3,
      lastEventType: "MOVED_TO_PORT",
    });
  });

  test("should reject replay when an event version is missing", () => {
    const events = [
      {
        aggregateId: "CNT-001",
        eventType: "CONTAINER_CREATED",
        payload: {
          location: "Warehouse-A",
        },
        version: 1,
      },
      {
        aggregateId: "CNT-001",
        eventType: "ARRIVED_AT_PORT",
        payload: {
          location: "Mumbai Port",
        },
        version: 3,
      },
    ];

    expect(() => replayEvents(events)).toThrow(
      "Invalid event version sequence: expected 2, received 3"
    );
  });

  test("should reject replay when event input is invalid", () => {
    expect(() => replayEvents(null)).toThrow(
      "Events must be an array"
    );
  });
});
