const { replayEvents } = require("../aggregates/replay");

function createBenchmarkEvents(count) {
  const events = [];

  for (let version = 1; version <= count; version += 1) {
    events.push({
      aggregateId: "CNT-BENCHMARK",
      aggregateType: "Container",
      eventType: version === 1 ? "CONTAINER_CREATED" : "MOVED",
      payload:
  version === 1
    ? {
        aggregateId: "CNT-BENCHMARK",
        location: "Warehouse-A",
      }
    : { location: `Port-${version}` },
      version,
      timestamp: new Date(
        Date.UTC(2026, 0, 1, 0, 0, version)
      ).toISOString(),
    });
  }

  return events;
}

describe("Replay performance benchmark", () => {
  const benchmarkSizes = [100, 500, 1000];

  test.each(benchmarkSizes)(
    "replays %i events successfully",
    (eventCount) => {
      const events = createBenchmarkEvents(eventCount);

      const start = process.hrtime.bigint();
      const state = replayEvents(events);
      const end = process.hrtime.bigint();

      const durationMs = Number(end - start) / 1_000_000;

      console.log(
        `Replay benchmark: ${eventCount} events -> ${durationMs.toFixed(
          3
        )} ms`
      );

      expect(state).toBeDefined();
      expect(state.version).toBe(eventCount);
      expect(state.location).toBe(`Port-${eventCount}`);
    }
  );

  test("replays a large event stream without losing the final state", () => {
    const events = createBenchmarkEvents(1000);

    const state = replayEvents(events);

    expect(state.version).toBe(1000);
    expect(state.id).toBe("CNT-BENCHMARK");
    expect(state.location).toBe("Port-1000");
  });
});