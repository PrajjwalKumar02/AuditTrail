jest.mock("../events/models/Event", () => {
  const Event = jest.fn();

  Event.find = jest.fn();
  Event.distinct = jest.fn();

  return Event;
});

jest.mock("../events/services/eventStore", () => ({
  verifyEventChain: jest.fn(),
}));

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

const Event = require("../events/models/Event");

const {
  verifyEventChain,
} = require("../events/services/eventStore");

const {
  verifyIntegrity,
  generateIntegrityReport,
  verifyAllAggregates,
  detectTampering,
} = require("../events/services/integrityService");

describe("Integrity Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return a valid result when event chain passes integrity verification", async () => {
    const verificationResult = {
      valid: true,
      message: "Event chain is valid",
      details: [],
    };

    verifyEventChain.mockResolvedValue(verificationResult);

    const result = await verifyIntegrity("container-001");

    expect(verifyEventChain).toHaveBeenCalledWith("container-001");
    expect(result).toEqual(verificationResult);
  });

  test("should return a failed result when event chain verification fails", async () => {
    const verificationResult = {
      valid: false,
      message: "Hash mismatch detected",
      details: ["Event version 2 is invalid"],
    };

    verifyEventChain.mockResolvedValue(verificationResult);

    const result = await verifyIntegrity("container-001");

    expect(verifyEventChain).toHaveBeenCalledWith("container-001");
    expect(result).toEqual(verificationResult);
  });

  test("should generate an empty integrity report when no events exist", async () => {
    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    const result = await generateIntegrityReport("container-001");

    expect(Event.find).toHaveBeenCalledWith({
      aggregateId: "container-001",
    });

    expect(result.aggregateId).toBe("container-001");
    expect(result.status).toBe("empty");
    expect(result.message).toBe("No events found");
  });

  test("should verify all aggregates and return summary", async () => {
    Event.distinct.mockResolvedValue([
      "container-001",
      "container-002",
    ]);

    verifyEventChain
      .mockResolvedValueOnce({
        valid: true,
        message: "Event chain is valid",
        details: [],
      })
      .mockResolvedValueOnce({
        valid: false,
        message: "Hash mismatch detected",
        details: [],
      });

    const result = await verifyAllAggregates();

    expect(Event.distinct).toHaveBeenCalledWith("aggregateId");

    expect(result.total).toBe(2);
    expect(result.passed).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.results["container-001"].valid).toBe(true);
    expect(result.results["container-002"].valid).toBe(false);
  });

  test("should report no tampering when event hashes and links are valid", async () => {
    const event1 = {
      aggregateId: "container-001",
      version: 1,
      eventType: "CONTAINER_CREATED",
      payload: { status: "created" },
      timestamp: new Date("2026-01-01T10:00:00.000Z"),
      previousHash: "0".repeat(64),
      currentHash: "placeholder",
    };

    const event2 = {
      aggregateId: "container-001",
      version: 2,
      eventType: "MOVED",
      payload: { location: "Mumbai Port" },
      timestamp: new Date("2026-01-01T11:00:00.000Z"),
      previousHash: "",
      currentHash: "placeholder",
    };

    const { generateEventHash } = require("../events/services/hash");

    event1.currentHash = generateEventHash(event1);
    event2.previousHash = event1.currentHash;
    event2.currentHash = generateEventHash(event2);

    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([event1, event2]),
    });

    const result = await detectTampering("container-001");

    expect(result.aggregateId).toBe("container-001");
    expect(result.totalEvents).toBe(2);
    expect(result.anomalies).toBe(0);
    expect(result.hasTampering).toBe(false);
    expect(result.details).toEqual([]);
  });

  test("should detect a hash mismatch when an event is modified", async () => {
    const event = {
      aggregateId: "container-001",
      version: 1,
      eventType: "CONTAINER_CREATED",
      payload: { status: "created" },
      timestamp: new Date("2026-01-01T10:00:00.000Z"),
      previousHash: "0".repeat(64),
      currentHash: "invalid-hash",
    };

    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([event]),
    });

    const result = await detectTampering("container-001");

    expect(result.hasTampering).toBe(true);
    expect(result.anomalies).toBe(1);
    expect(result.details[0].type).toBe("hash_mismatch");
  });

  test("should detect a broken hash chain", async () => {
    const event1 = {
      aggregateId: "container-001",
      version: 1,
      eventType: "CONTAINER_CREATED",
      payload: { status: "created" },
      timestamp: new Date("2026-01-01T10:00:00.000Z"),
      previousHash: "0".repeat(64),
      currentHash: "a".repeat(64),
    };

    const event2 = {
      aggregateId: "container-001",
      version: 2,
      eventType: "MOVED",
      payload: { location: "Mumbai Port" },
      timestamp: new Date("2026-01-01T11:00:00.000Z"),
      previousHash: "broken-chain",
      currentHash: "b".repeat(64),
    };

    Event.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([event1, event2]),
    });

    const result = await detectTampering("container-001");

    expect(result.hasTampering).toBe(true);
    expect(result.details.some(
      (item) => item.type === "chain_break"
    )).toBe(true);
  });
});