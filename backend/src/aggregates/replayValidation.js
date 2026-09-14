function validateReplayEvents(events) {
  if (!Array.isArray(events)) {
    throw new TypeError("Events must be an array");
  }

  if (events.length === 0) {
    return true;
  }

  const orderedEvents = [...events].sort((a, b) => {
    return a.version - b.version;
  });

  orderedEvents.forEach((event, index) => {
    if (!event || typeof event !== "object") {
      throw new TypeError(`Invalid event at index ${index}`);
    }

    if (!Number.isInteger(event.version) || event.version < 1) {
      throw new Error(
        `Invalid event version at index ${index}`
      );
    }
  });

  orderedEvents.forEach((event, index) => {
    const expectedVersion = index + 1;

    if (event.version !== expectedVersion) {
      throw new Error(
        `Invalid event version sequence: expected ${expectedVersion}, received ${event.version}`
      );
    }
  });

  return true;
}

module.exports = {
  validateReplayEvents,
};
