const {
  generateHash,
  generateCombinedHash,
  verifyHash,
  generateMerkleRoot,
  generateTimestampedHash,
  generateSaltedHash
} = require('../events/services/hash');

describe('Cryptography utilities', () => {
  test('should generate a SHA-256 hash', () => {
    const hash = generateHash('test data');

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  test('should generate the same hash for the same data', () => {
    const hash1 = generateHash('test data');
    const hash2 = generateHash('test data');

    expect(hash1).toBe(hash2);
  });

  test('should verify a valid hash', () => {
    const hash = generateHash('test data');

    expect(verifyHash(hash, hash)).toBe(true);
  });

  test('should reject an invalid hash', () => {
    const hash1 = generateHash('test data');
    const hash2 = generateHash('different data');

    expect(verifyHash(hash1, hash2)).toBe(false);
  });

  test('should generate a combined hash independent of object key order', () => {
    const hash1 = generateCombinedHash({
      aggregateId: 'container-1',
      version: 1
    });

    const hash2 = generateCombinedHash({
      version: 1,
      aggregateId: 'container-1'
    });

    expect(hash1).toBe(hash2);
  });

  test('should generate a Merkle root for multiple hashes', () => {
    const hashes = [
      generateHash('event-1'),
      generateHash('event-2'),
      generateHash('event-3'),
      generateHash('event-4')
    ];

    const root = generateMerkleRoot(hashes);

    expect(root).toHaveLength(64);
    expect(root).toMatch(/^[a-f0-9]{64}$/);
  });

  test('should return the same hash for a single-item Merkle tree', () => {
    const hash = generateHash('event-1');

    expect(generateMerkleRoot([hash])).toBe(hash);
  });

  test('should return a zero hash for an empty Merkle tree', () => {
    const root = generateMerkleRoot([]);

    expect(root).toBe('0'.repeat(64));
  });

  test('should generate a timestamped hash', () => {
    const timestamp = new Date('2026-01-01T00:00:00.000Z');

    const hash = generateTimestampedHash('event-data', timestamp);

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  test('should generate different hashes for different salts', () => {
    const hash1 = generateSaltedHash('event-data', 'salt-1');
    const hash2 = generateSaltedHash('event-data', 'salt-2');

    expect(hash1).not.toBe(hash2);
  });
});