const crypto = require("crypto");

const generateHash = (data) => {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
};

const verifyHash = (data, expectedHash) => {
  const actualHash = generateHash(data);
  return actualHash === expectedHash;
};

module.exports = {
  generateHash,
  verifyHash,
};