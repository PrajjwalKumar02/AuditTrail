require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const { connectDB } = require('../src/config/db');
const { NODE_ENV } = require('../src/config/env');

// Check environment
if (NODE_ENV === 'production') {
  console.error('❌ Cannot reset database in production!');
  process.exit(1);
}

function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function resetDatabase() {
  console.log('═══════════════════════════════════════');
  console.log('⚠️  DATABASE RESET');
  console.log('═══════════════════════════════════════');
  console.log('This will DELETE ALL DATA from:');
  console.log('   - Events');
  console.log('   - Read Models');
  console.log('   - Snapshots');
  console.log('   - Users');
  console.log('═══════════════════════════════════════\n');

  const confirmed = await askConfirmation(
    'Are you sure you want to delete ALL data? (yes/no): '
  );

  if (!confirmed) {
    console.log('\n❌ Reset cancelled\n');
    process.exit(0);
  }

  try {
    await connectDB();
    console.log('✅ Database connected\n');

    // Collections to clear
    const collections = ['events', 'containerreadmodels', 'snapshots', 'users'];

    for (const collectionName of collections) {
      try {
        const collection = mongoose.connection.collection(collectionName);
        const count = await collection.countDocuments();
        await collection.deleteMany({});
        console.log(`   ✅ Cleared ${collectionName}: ${count} documents deleted`);
      } catch (error) {
        console.log(`   ⚠️ Could not clear ${collectionName}: ${error.message}`);
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✅ Database reset complete!');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  resetDatabase();
}

module.exports = { resetDatabase };
