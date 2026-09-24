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

  test("passes when expected version matches current version", async () => {
    Event.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue({ version: 3 }),
    });

    await expect(checkExpectedVersion("CNT-001", 3)).resolves.toBe(3);
  });

  test("throws a 409 conflict when versions do not match", async () => {
    Event.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue({ version: 4 }),
    });

    await expect(
      checkExpectedVersion("CNT-001", 3)
    ).rejects.toMatchObject({
      statusCode: 409,
      name: "OptimisticConcurrencyError",
      details: {
        aggregateId: "CNT-001",
        expectedVersion: 3,
        currentVersion: 4,
        conflict: true,
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
    expect(Event.countDocuments).toHaveBeenCalledWith({
      aggregateId: "CNT-001",
    });
  });

  test("returns false when an aggregate has no events", async () => {
    Event.countDocuments.mockResolvedValue(0);

    await expect(aggregateExists("CNT-001")).resolves.toBe(false);
  });

  test("returns the number of events for an aggregate", async () => {
    Event.countDocuments.mockResolvedValue(5);

    await expect(getEventCount("CNT-001")).resolves.toBe(5);
  });

  test("handles event store errors when checking current version", async () => {
    Event.findOne.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error("Database unavailable")),
    });

    await expect(getCurrentVersion("CNT-001")).rejects.toThrow(
      "Failed to get current version: Database unavailable"
    );
  });
});
