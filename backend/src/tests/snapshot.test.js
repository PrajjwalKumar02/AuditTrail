const mongoose = require("mongoose");

const Snapshot = require("../snapshots/Snapshot");

describe("Snapshot Model", () => {
  test("should create a valid snapshot with required fields", () => {
    const snapshot = new Snapshot({
      aggregateId: "CNT-001",
      state: {
        id: "CNT-001",
        status: "LOADED",
        location: "Warehouse-A",
        version: 10,
      },
      version: 10,
      eventCount: 10,
      lastEventId: "event-010",
    });

    const error = snapshot.validateSync();

    expect(error).toBeUndefined();
    expect(snapshot.aggregateId).toBe("CNT-001");
    expect(snapshot.aggregateType).toBe("Container");
    expect(snapshot.version).toBe(10);
    expect(snapshot.eventCount).toBe(10);
    expect(snapshot.lastEventId).toBe("event-010");
  });

  test("should require aggregateId", () => {
    const snapshot = new Snapshot({
      state: {
        status: "CREATED",
      },
      version: 1,
      eventCount: 1,
      lastEventId: "event-001",
    });

    const error = snapshot.validateSync();

    expect(error.errors.aggregateId).toBeDefined();
  });

  test("should require state", () => {
    const snapshot = new Snapshot({
      aggregateId: "CNT-002",
      version: 1,
      eventCount: 1,
      lastEventId: "event-001",
    });

    const error = snapshot.validateSync();

    expect(error.errors.state).toBeDefined();
  });

  test("should require version", () => {
    const snapshot = new Snapshot({
      aggregateId: "CNT-003",
      state: {
        status: "CREATED",
      },
      eventCount: 1,
      lastEventId: "event-001",
    });

    const error = snapshot.validateSync();

    expect(error.errors.version).toBeDefined();
  });

  test("should require eventCount", () => {
    const snapshot = new Snapshot({
      aggregateId: "CNT-004",
      state: {
        status: "CREATED",
      },
      version: 1,
      lastEventId: "event-001",
    });

    const error = snapshot.validateSync();

    expect(error.errors.eventCount).toBeDefined();
  });

  test("should require lastEventId", () => {
    const snapshot = new Snapshot({
      aggregateId: "CNT-005",
      state: {
        status: "CREATED",
      },
      version: 1,
      eventCount: 1,
    });

    const error = snapshot.validateSync();

    expect(error.errors.lastEventId).toBeDefined();
  });

  test("should use Container as the default aggregate type", () => {
    const snapshot = new Snapshot({
      aggregateId: "CNT-006",
      state: {
        status: "CREATED",
      },
      version: 1,
      eventCount: 1,
      lastEventId: "event-001",
    });

    expect(snapshot.aggregateType).toBe("Container");
  });

  test("should define the aggregateId and version compound index", () => {
    const indexes = Snapshot.schema.indexes();

    expect(indexes).toEqual(
      expect.arrayContaining([
        [
          {
            aggregateId: 1,
            version: -1,
          },
          expect.any(Object),
        ],
      ])
    );
  });

  afterAll(() => {
    mongoose.deleteModel("Snapshot");
  });
});
