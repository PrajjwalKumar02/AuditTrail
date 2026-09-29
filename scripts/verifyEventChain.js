require('dotenv').config();
const { connectDB } = require('../src/config/db');
const { verifyChain } = require('../src/events/services/integrityService');
const { getAllAggregates } = require('../src/events/services/eventStore');
const Event = require('../src/events/models/Event');

async function verifyContainer(aggregateId) {
  console.log(`\n🔍 Verifying: ${aggregateId}`);
  console.log('─'.repeat(50));

  try {
    const result = await verifyChain(aggregateId);

    if (result.valid) {
      console.log(`   ✅ Chain VALID`);
      console.log(`   📝 Events verified: ${result.totalEvents || 'N/A'}`);
      
      // Show event summary
      const events = await Event.find({ aggregateId }).sort({ version: 1 });
      console.log(`\n   Event History:`);
      events.forEach(e => {
        const shortHash = e.currentHash.substring(0, 12);
        console.log(`   v${e.version} ${e.eventType} [${shortHash}...]`);
      });

      return { aggregateId, valid: true };
    } else {
      console.log(`   ❌ Chain INVALID`);
      console.log(`   ⚠️ Failed at: ${result.failedAt || 'unknown'}`);
      console.log(`   Message: ${result.message || 'Hash mismatch'}`);
      
      return { aggregateId, valid: false, error: result.message };
    }

  } catch (error) {
    console.log(`   ❌ Verification error: ${error.message}`);
    return { aggregateId, valid: false, error: error.message };
  }
}

async function verifyAll() {
  console.log('═══════════════════════════════════════');
  console.log('🔐 Event Chain Integrity Verification');
  console.log('═══════════════════════════════════════');

  try {
    // Connect
    await connectDB();
    console.log('✅ Database connected\n');

    // Get all aggregates
    const aggregates = await getAllAggregates();
    
    if (aggregates.length === 0) {
      console.log('⚠️ No aggregates found in database');
      process.exit(0);
    }

    console.log(`📦 Found ${aggregates.length} containers\n`);

    // Verify each
    const results = [];
    for (const id of aggregates) {
      const result = await verifyContainer(id);
      results.push(result);
    }

    // Summary
    console.log('\n═══════════════════════════════════════');
    console.log('📊 Verification Summary');
    console.log('═══════════════════════════════════════');

    const valid = results.filter(r => r.valid).length;
    const invalid = results.filter(r => !r.valid).length;

    console.log(`   Total:   ${results.length}`);
    console.log(`   ✅ Valid:   ${valid}`);
    console.log(`   ❌ Invalid: ${invalid}`);

    if (invalid > 0) {
      console.log('\n   ⚠️ Invalid containers:');
      results
        .filter(r => !r.valid)
        .forEach(r => {
          console.log(`   ❌ ${r.aggregateId}: ${r.error}`);
        });
    }

    console.log('═══════════════════════════════════════');

    if (invalid === 0) {
      console.log('🎉 All chains are intact!\n');
      process.exit(0);
    } else {
      console.log('🚨 Some chains are broken!\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

async function main() {
  const aggregateId = process.argv[2];
  const verifyAll = process.argv.includes('--all');

  if (verifyAll || !aggregateId) {
    await verifyAll();
  } else {
    await connectDB();
    const result = await verifyContainer(aggregateId);
    process.exit(result.valid ? 0 : 1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { verifyContainer, verifyAll };
