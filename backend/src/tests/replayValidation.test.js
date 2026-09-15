const {
  validateReplayEvents,
} = require("../aggregates/replayValidation");

describe("Replay Validation", () => {
  test("should accept a valid sequential event stream", () => {
    const events = [
      { version: 1, eventType: "CONTAINER_CREATED" },
      { version: 2, eventType: "LOADED_ON_SHIP" },
      { version: 3, eventType: "MOVED_TO_PORT" },
    ];

    expect(validateReplayEvents(events)).toBe(true);
  });

  test("should accept events provided out of order", () => {
    const events = [
      { version: 3, eventType: "MOVED_TO_PORT" },
      { version: 1, eventType: "CONTAINER_CREATED" },
      { version: 2, eventType: "LOADED_ON_SHIP" },
    ];

    expect(validateReplayEvents(events)).toBe(true);
  });

  test("should reject a version gap", () => {
    const events = [
      { version: 1, eventType: "CONTAINER_CREATED" },
      { version: 2, eventType: "LOADED_ON_SHIP" },
      { version: 4, eventType: "ARRIVED_AT_PORT" },
    ];

    expect(() => validateReplayEvents(events)).toThrow(
      "Invalid event version sequence: expected 3, received 4"
    );
  });

  test("should reject duplicate versions", () => {
    const events = [
      { version: 1, eventType: "CONTAINER_CREATED" },
      { version: 2, eventType: "LOADED_ON_SHIP" },
      { version: 2, eventType: "MOVED_TO_PORT" },
    ];

    expect(() => validateReplayEvents(events)).toThrow(
      "Invalid event version sequence: expected 3, received 2"
    );
  });

  test("should reject invalid event versions", () => {
    const events = [
      { version: 1, eventType: "CONTAINER_CREATED" },
      { version: "2", eventType: "LOADED_ON_SHIP" },
    ];

    expect(() => validateReplayEvents(events)).toThrow(
      "Invalid event version at index 1"
    );
  });

  test("should reject non-array input", () => {
    expect(() => validateReplayEvents(null)).toThrow(
      "Events must be an array"
    );
  });
});
