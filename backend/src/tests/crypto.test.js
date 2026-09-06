const { generateHash, verifyHash } = require("../utils/crypto");

describe("Cryptography utilities", () => {
  test("should generate a SHA-256 hash", () => {
    const data = {
      eventType: "ContainerCreated",
      aggregateId: "container-001",
    };

    const hash = generateHash(data);

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });

  test("should generate the same hash for the same data", () => {
    const data = {
      eventType: "ContainerCreated",
      aggregateId: "container-001",
    };

    const hash1 = generateHash(data);
    const hash2 = generateHash(data);

    expect(hash1).toBe(hash2);
  });

  test("should verify a valid hash", () => {
    const data = {
      eventType: "ContainerCreated",
      aggregateId: "container-001",
    };

    const hash = generateHash(data);

    expect(verifyHash(data, hash)).toBe(true);
  });

  test("should reject an invalid hash", () => {
    const data = {
      eventType: "ContainerCreated",
      aggregateId: "container-001",
    };

    const hash = generateHash(data);

    const modifiedData = {
      ...data,
      aggregateId: "container-002",
    };

    expect(verifyHash(modifiedData, hash)).toBe(false);
  });
});