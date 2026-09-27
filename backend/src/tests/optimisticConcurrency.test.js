const {
  checkExpectedVersion,
  getCurrentVersion,
  aggregateExists,
  getEventCount,
} = require("../concurrency/optimisticConcurrency");

const Event = require("../events/models/Event");

jest.mock("../events/models/Event", () => ({
  findOne: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock("../utils/logger", () => ({
  warn: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe("Optimistic Concurrency Control", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("passes with version zero for a new aggregate", async () => {
    Event.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue(null),
    });

    await expect(checkExpectedVersion("CNT-NEW", 0)).resolves.toBe(0);
  });

  test("includes expected and current versions in conflict details", async () => {
    Event.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue({ version: 6 }),
    });

    await expect(
      checkExpectedVersion("CNT-001", 4)
    ).rejects.toMatchObject({
      statusCode: 409,
      name: "OptimisticConcurrencyError",
      details: {
        aggregateId: "CNT-001",
        expectedVersion: 4,
        currentVersion: 6,
        conflict: true,
        suggestion: "Please use version 6 for the next operation",
      },
    });
  });

  test("returns zero when the aggregate has no events", async () => {
    Event.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue(null),
    });

    await expect(getCurrentVersion("CNT-001")).resolves.toBe(0);
  });

  test("returns the latest event version", async () => {
    Event.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue({ version: 7 }),
    });

    await expect(getCurrentVersion("CNT-001")).resolves.toBe(7);
  });

  test("checks whether an aggregate exists", async () => {
    Event.countDocuments.mockResolvedValue(2);

    await expect(aggregateExists("CNT-001")).resolves.toBe(true);
  });

  test("returns false when an aggregate has no events", async () => {
    Event.countDocuments.mockResolvedValue(0);

    await expect(aggregateExists("CNT-001")).resolves.toBe(false);
  });

  test("returns the number of events for an aggregate", async () => {
    Event.countDocuments.mockResolvedValue(5);

    await expect(getEventCount("CNT-001")).resolves.toBe(5);
  });

  test("handles current version database errors", async () => {
    Event.findOne.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error("Database unavailable")),
    });

    await expect(getCurrentVersion("CNT-001")).rejects.toThrow(
      "Failed to get current version: Database unavailable"
    );
  });

  test("returns false when aggregate existence check fails", async () => {
    Event.countDocuments.mockRejectedValue(
      new Error("Database unavailable")
    );

    await expect(aggregateExists("CNT-001")).resolves.toBe(false);
  });

  test("returns zero when event count check fails", async () => {
    Event.countDocuments.mockRejectedValue(
      new Error("Database unavailable")
    );

    await expect(getEventCount("CNT-001")).resolves.toBe(0);
  });
});
