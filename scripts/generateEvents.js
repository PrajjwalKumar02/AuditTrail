require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');
const { appendEvent } = require('../src/events/services/eventStore');
const { projectContainer } = require('../src/projections/projectionService');
const logger = require('../src/utils/logger');

// Random data generators
const LOCATIONS = [
  'Warehouse-A', 'Warehouse-B', 'Warehouse-C', 'Warehouse-D',
  'Dock-1', 'Dock-2', 'Dock-3', 'Dock-4',
  'Mumbai Port', 'Shanghai Port', 'Singapore Port', 'Dubai Port',
  'Rotterdam Port', 'Los Angeles Port', 'Hamburg Port'
];

const SHIPS = [
  'MSC-001', 'MSC-002', 'MAERSK-001', 'MAERSK-002',
  'CMA-CGM-001', 'ONE-001', 'EVERGREEN-001', 'HAPAG-001'
];

const EVENT_TYPES = [
  'CONTAINER_CREATED',
  'LOADED_ON_SHIP',
  'MOVED',
  'ARRIVED_AT_PORT',
  'TEMPERATURE_SPIKE'
];

// Random helpers
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomTemp = (min = 2, max = 25) => Number((Math.random() * (max - min) + min).toFixed(1));
const randomShip = () => randomItem(SHIPS);

function generateRandomEvent(aggregateId, currentVersion) {
  let eventType, payload;

  // First event must be CONTAINER_CREATED
  if (currentVersion === 0) {
    eventType = 'CONTAINER_CREATED';
    payload = { location: randomItem(LOCATIONS) };
  } else {
    // Weighted random selection
    const rand = Math.random();
    if (rand < 0.15) {
      eventType = 'LOADED_ON_SHIP';
      payload = { ship: randomShip(), location: randomItem(LOCATIONS) };
    } else if (rand < 0.35) {
      eventType = 'MOVED';
      payload = { location: randomItem(LOCATIONS) };
    } else if (rand < 0.65) {
      eventType = 'TEMPERATURE_SPIKE';
      payload = { temperature: randomTemp() };
    } else if (rand < 0.85) {
      eventType = 'ARRIVED_AT_PORT';
      payload = { location: randomItem(LOCATIONS) };
    } else {
      // Rare events
      const rare = Math.random();
      if (rare < 0.5) {
        eventType = 'CONTAINER_DAMAGED';
        payload = { reason: 'Physical damage detected', severity: 'high' };
      } else {
        eventType = 'CONTAINER_DELAYED';
        payload = { reason: 'Weather conditions', duration: Math.floor(Math.random() * 24) };
      }
    }
  }

  return { eventType, payload };
}

async function generateContainerEvents(containerId, eventCount) {
  console.log(`\n📦 Generating ${eventCount} events for ${containerId}...`);
  
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < eventCount; i++) {
    try {
      // Get current version
      const Event = require('../src/events/models/Event');
      const lastEvent = await Event.findOne({ aggregateId: containerId }).sort({ version: -1 });
      const currentVersion = lastEvent ? lastEvent.version : 0;

      // Generate event
      const { eventType, payload } = generateRandomEvent(containerId, currentVersion);

      // Append event
      await appendEvent({
        aggregateId: containerId,
        aggregateType: 'Container',
        eventType,
        payload,
        metadata: {
          source: 'generate_events',
          generated: true,
          timestamp: new Date().toISOString()
        }
      });

      successCount++;
      process.stdout.write(`\r   Progress: ${i + 1}/${eventCount} ✅`);

      // Small delay to make timestamps different
      await new Promise(resolve => setTimeout(resolve, 50));

    } catch (error) {
      failCount++;
      console.log(`\n   ❌ Failed: ${error.message}`);
    }
  }

  console.log(`\n   ✅ Success: ${successCount}, ❌ Failed: ${failCount}`);
  return { successCount, failCount };
}

async function generateEvents() {
  const eventCount = parseInt(process.argv[2]) || 50;
  const containerCount = parseInt(process.argv[3]) || 5;

  console.log('═══════════════════════════════════════');
  console.log('🎲 Event Generator');
  console.log('═══════════════════════════════════════');
  console.log(`   Containers: ${containerCount}`);
  console.log(`   Events per container: ${eventCount}`);
  console.log(`   Total events: ${containerCount * eventCount}`);
  console.log('═══════════════════════════════════════');

  try {
    // Connect
    await connectDB();
    console.log('✅ Database connected\n');

    let totalSuccess = 0;
    let totalFail = 0;

    // Generate events for each container
    for (let i = 1; i <= containerCount; i++) {
      const containerId = `CTNR-${String(i).padStart(3, '0')}`;
      const result = await generateContainerEvents(containerId, eventCount);
      totalSuccess += result.successCount;
      totalFail += result.failCount;

      // Project to read model
      try {
        await projectContainer(containerId);
      } catch (error) {
        console.log(`   ⚠️ Projection failed: ${error.message}`);
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✅ Generation Complete');
    console.log('═══════════════════════════════════════');
    console.log(`   📝 Total events: ${totalSuccess + totalFail}`);
    console.log(`   ✅ Success: ${totalSuccess}`);
    console.log(`   ❌ Failed: ${totalFail}`);
    console.log('═══════════════════════════════════════\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  generateEvents();
}

module.exports = { generateEvents, generateContainerEvents, generateRandomEvent };
