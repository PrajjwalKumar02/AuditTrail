require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');
const { appendEvent } = require('../src/events/services/eventStore');
const { projectContainer } = require('../src/projections/projectionService');

// Sample container data
const SAMPLE_CONTAINERS = [
  {
    id: 'CTNR-001',
    events: [
      { type: 'CONTAINER_CREATED', payload: { location: 'Warehouse-A' } },
      { type: 'LOADED_ON_SHIP', payload: { ship: 'MSC-001', location: 'Dock-1' } },
      { type: 'TEMPERATURE_SPIKE', payload: { temperature: 12.8 } },
      { type: 'ARRIVED_AT_PORT', payload: { location: 'Mumbai Port' } }
    ]
  },
  {
    id: 'CTNR-002',
    events: [
      { type: 'CONTAINER_CREATED', payload: { location: 'Warehouse-B' } },
      { type: 'LOADED_ON_SHIP', payload: { ship: 'MAERSK-002', location: 'Dock-2' } },
      { type: 'TEMPERATURE_SPIKE', payload: { temperature: 8.5 } },
      { type: 'MOVED', payload: { location: 'Singapore Port' } },
      { type: 'TEMPERATURE_SPIKE', payload: { temperature: 15.2 } },
      { type: 'ARRIVED_AT_PORT', payload: { location: 'Shanghai Port' } }
    ]
  },
  {
    id: 'CTNR-003',
    events: [
      { type: 'CONTAINER_CREATED', payload: { location: 'Warehouse-C' } },
      { type: 'LOADED_ON_SHIP', payload: { ship: 'CMA-CGM-003', location: 'Dock-3' } },
      { type: 'TEMPERATURE_SPIKE', payload: { temperature: 4.2 } },
      { type: 'ARRIVED_AT_PORT', payload: { location: 'Dubai Port' } }
    ]
  },
  {
    id: 'CTNR-004',
    events: [
      { type: 'CONTAINER_CREATED', payload: { location: 'Warehouse-A' } },
      { type: 'TEMPERATURE_SPIKE', payload: { temperature: 22.5 } },
      { type: 'MOVED', payload: { location: 'Cold Storage' } },
      { type: 'ARRIVED_AT_PORT', payload: { location: 'Rotterdam Port' } }
    ]
  },
  {
    id: 'CTNR-005',
    events: [
      { type: 'CONTAINER_CREATED', payload: { location: 'Warehouse-D' } },
      { type: 'LOADED_ON_SHIP', payload: { ship: 'ONE-005', location: 'Dock-4' } },
      { type: 'TEMPERATURE_SPIKE', payload: { temperature: 6.8 } },
      { type: 'TEMPERATURE_SPIKE', payload: { temperature: 11.5 } },
      { type: 'TEMPERATURE_SPIKE', payload: { temperature: 18.3 } },
      { type: 'ARRIVED_AT_PORT', payload: { location: 'Los Angeles Port' } }
    ]
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    let totalEvents = 0;

    // Seed each container
    for (const container of SAMPLE_CONTAINERS) {
      console.log(`📦 Seeding ${container.id}...`);

      for (const event of container.events) {
        try {
          await appendEvent({
            aggregateId: container.id,
            aggregateType: 'Container',
            eventType: event.type,
            payload: event.payload,
            metadata: {
              source: 'seed_script',
              seeded: true,
              timestamp: new Date().toISOString()
            }
          });
          totalEvents++;
          console.log(`   ✅ ${event.type}`);
        } catch (error) {
          console.log(`   ❌ ${event.type}: ${error.message}`);
        }
      }

      // Project the container to read model
      try {
        await projectContainer(container.id);
        console.log(`   📊 Projected to read model`);
      } catch (error) {
        console.log(`   ⚠️ Projection failed: ${error.message}`);
      }

      console.log('');
    }

    console.log('═══════════════════════════════════════');
    console.log(`✅ Seeding complete!`);
    console.log(`   📦 Containers: ${SAMPLE_CONTAINERS.length}`);
    console.log(`   📝 Events: ${totalEvents}`);
    console.log('═══════════════════════════════════════\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, SAMPLE_CONTAINERS };
