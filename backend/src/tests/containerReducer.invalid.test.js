const {
  initialState,
} = require("../aggregates/container/containerState");

const {
  applyEvent,
} = require("../aggregates/container/containerReducer");

describe("Container Reducer - Invalid Events", () => {
  test("should reject a null event", () => {
    const state = initialState();

    expect(() => applyEvent(state, null)).toThrow(TypeError);
  });

  test("should reject an undefined event", () => {
    const state = initialState();

    expect(() => applyEvent(state, undefined)).toThrow(TypeError);
  });

  test("should handle an event with missing event type", () => {
    const state = initialState();

    const result = applyEvent(state, {
      payload: {},
      version: 1,
      timestamp: "2026-09-16T10:00:00.000Z",
    });

    expect(result).toMatchObject({
      status: "CREATED",
      version: 1,
      metadata: {
        totalEvents: 1,
        lastEventType: undefined,
        lastEventTimestamp: "2026-09-16T10:00:00.000Z",
      },
    });
  });

  test("should reject an invalid status transition", () => {
    const state = initialState();

    state.status = "ARRIVED";

    expect(() =>
      applyEvent(state, {
        eventType: "LOADED_ON_SHIP",
        payload: {
          ship: "MSC-001",
        },
        version: 2,
        timestamp: "2026-09-16T10:00:00.000Z",
      })
    ).toThrow("Invalid status transition: ARRIVED -> LOADED");
  });

  test("should preserve state when an unknown event type is received", () => {
    const state = initialState();

    const result = applyEvent(state, {
      eventType: "UNKNOWN_EVENT",
      payload: {},
      version: 1,
      timestamp: "2026-09-16T10:00:00.000Z",
    });

    expect(result).toMatchObject({
      id: null,
      location: null,
      status: "CREATED",
      ship: null,
      version: 1,
      metadata: {
        totalEvents: 1,
        lastEventType: "UNKNOWN_EVENT",
        lastEventTimestamp: "2026-09-16T10:00:00.000Z",
      },
    });
  });

  test("should accept a loaded event from the initial CREATED state", () => {
    const state = initialState();

    expect(() =>
      applyEvent(state, {
        eventType: "LOADED_ON_SHIP",
        payload: {
          ship: "MSC-001",
        },
        version: 1,
        timestamp: "2026-09-16T10:00:00.000Z",
      })
    ).not.toThrow();
  });
});