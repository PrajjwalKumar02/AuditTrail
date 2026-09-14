const crypto = require('crypto');

/**
 * Generate SHA-256 hash of any data
 * @param {any} data - Data to hash (object, string, array)
 * @returns {string} - 64 character hex string
 */
const generateHash = (data) => {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');
};

/**
 * Generate hash of multiple fields combined in deterministic order
 * @param {Object} fields - Object with fields to combine
 * @returns {string} - Combined hash
 */
const generateCombinedHash = (fields) => {
  // Sort keys to ensure deterministic hash
  const sortedKeys = Object.keys(fields).sort();
  const sortedData = {};
  sortedKeys.forEach(key => {
    sortedData[key] = fields[key];
  });
  return generateHash(sortedData);
};

/**
 * Verify if two hashes match
 * @param {string} hash1 - First hash
 * @param {string} hash2 - Second hash
 * @returns {boolean} - True if they match
 */
const verifyHash = (hash1, hash2) => {
  return hash1 === hash2;
};

/**
 * Generate event hash with all required fields
 * @param {Object} event - Event object
 * @returns {string} - Event hash
 */
const generateEventHash = (event) => {
  const { previousHash, payload, version, timestamp, aggregateId, eventType } = event;
  return generateHash({
    previousHash,
    payload,
    version,
    timestamp: timestamp.toISOString(),
    aggregateId,
    eventType
  });
};

/**
 * Generate a merkle tree root hash from multiple hashes
 * @param {string[]} hashes - Array of hashes
 * @returns {string} - Root hash
 */
const generateMerkleRoot = (hashes) => {
  if (hashes.length === 0) return '0'.repeat(64);
  if (hashes.length === 1) return hashes[0];
  
  const combined = [];
  for (let i = 0; i < hashes.length; i += 2) {
    if (i + 1 < hashes.length) {
      combined.push(generateHash(hashes[i] + hashes[i + 1]));
    } else {
      combined.push(hashes[i]);
    }
  }
  return generateMerkleRoot(combined);
};

/**
 * Generate timestamp-based hash (for time-based verification)
 * @param {any} data - Data to hash
 * @param {Date} timestamp - Timestamp to include
 * @returns {string} - Hash with timestamp
 */
const generateTimestampedHash = (data, timestamp = new Date()) => {
  const combined = {
    data,
    timestamp: timestamp.toISOString()
  };
  return generateHash(combined);
};

/**
 * Generate salt and hash combination
 * @param {any} data - Data to hash
 * @param {string} salt - Salt string
 * @returns {string} - Salted hash
 */
const generateSaltedHash = (data, salt) => {
  return generateHash({
    data,
    salt
  });
};

module.exports = {
  generateHash,
  generateCombinedHash,
  verifyHash,
  generateEventHash,
  generateMerkleRoot,
  generateTimestampedHash,
  generateSaltedHash
};
