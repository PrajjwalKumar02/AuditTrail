const Event = require('../models/Event');
const { verifyEventChain } = require('./eventStore');
const { generateMerkleRoot } = require('./hash');
const logger = require('../../utils/logger');

const verifyIntegrity = async (aggregateId) => {
  try {
    const result = await verifyEventChain(aggregateId);
    
    if (!result.valid) {
      logger.warn(`⚠️ Integrity check failed for ${aggregateId}`, {
        message: result.message,
        details: result.details
      });
    } else {
      logger.info(`✅ Integrity check passed for ${aggregateId}`);
    }
    
    return result;
    
  } catch (error) {
    logger.error(`Integrity check error: ${error.message}`);
    return { valid: false, message: error.message };
  }
};

const generateIntegrityReport = async (aggregateId) => {
  try {
    const events = await Event.find({ aggregateId }).sort({ version: 1 });
    
    if (events.length === 0) {
      return {
        aggregateId,
        status: 'empty',
        message: 'No events found',
        timestamp: new Date().toISOString()
      };
    }

    const hashes = events.map(e => e.currentHash);
    const merkleRoot = generateMerkleRoot(hashes);
    const verification = await verifyEventChain(aggregateId);

    return {
      aggregateId,
      status: verification.valid ? 'verified' : 'corrupted',
      totalEvents: events.length,
      firstEvent: {
        version: events[0].version,
        type: events[0].eventType,
        timestamp: events[0].timestamp
      },
      lastEvent: {
        version: events[events.length - 1].version,
        type: events[events.length - 1].eventType,
        timestamp: events[events.length - 1].timestamp
      },
      merkleRoot,
      verification: verification.valid ? 'PASSED' : 'FAILED',
      details: verification.details || null,
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    logger.error(`Failed to generate integrity report: ${error.message}`);
    return null;
  }
};

const verifyAllAggregates = async () => {
  try {
    const aggregates = await Event.distinct('aggregateId');
    const results = {};

    for (const id of aggregates) {
      results[id] = await verifyIntegrity(id);
    }

    const total = aggregates.length;
    const passed = Object.values(results).filter(r => r.valid).length;

    return {
      total,
      passed,
      failed: total - passed,
      results,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    logger.error(`Failed to verify all aggregates: ${error.message}`);
    return null;
  }
};

const detectTampering = async (aggregateId) => {
  const events = await Event.find({ aggregateId }).sort({ version: 1 });
  const anomalies = [];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    
    const { generateEventHash } = require('./hash');
    const computedHash = generateEventHash(event);
    if (computedHash !== event.currentHash) {
      anomalies.push({
        version: event.version,
        type: 'hash_mismatch',
        message: `Hash mismatch at version ${event.version}`,
        stored: event.currentHash.substring(0, 16) + '...',
        computed: computedHash.substring(0, 16) + '...'
      });
    }

    if (i > 0) {
      const prevEvent = events[i - 1];
      if (event.previousHash !== prevEvent.currentHash) {
        anomalies.push({
          version: event.version,
          type: 'chain_break',
          message: `Chain broken at version ${event.version}`,
          expected: prevEvent.currentHash.substring(0, 16) + '...',
          actual: event.previousHash.substring(0, 16) + '...'
        });
      }
    }
  }

  return {
    aggregateId,
    totalEvents: events.length,
    anomalies: anomalies.length,
    details: anomalies,
    hasTampering: anomalies.length > 0,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  verifyIntegrity,
  generateIntegrityReport,
  verifyAllAggregates,
  detectTampering
};
