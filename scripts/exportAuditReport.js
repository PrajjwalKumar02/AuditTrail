require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDB } = require('../src/config/db');
const { getEventsForAggregate } = require('../src/events/services/eventStore');
const { verifyChain } = require('../src/events/services/integrityService');

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'exports');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function exportJSON(aggregateId, data) {
  const filename = `${aggregateId}_audit_${Date.now()}.json`;
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  return filepath;
}

function exportCSV(aggregateId, data) {
  const filename = `${aggregateId}_audit_${Date.now()}.csv`;
  const filepath = path.join(OUTPUT_DIR, filename);

  // CSV headers
  const headers = [
    'Version',
    'Event Type',
    'Timestamp',
    'Location',
    'Ship',
    'Temperature',
    'Current Hash',
    'Previous Hash'
  ];

  // CSV rows
  const rows = data.events.map(e => [
    e.version,
    e.eventType,
    new Date(e.timestamp).toISOString(),
    e.payload.location || '',
    e.payload.ship || '',
    e.payload.temperature || '',
    e.currentHash,
    e.previousHash
  ]);

  // Build CSV
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  fs.writeFileSync(filepath, csv);
  return filepath;
}

function exportTXT(aggregateId, data) {
  const filename = `${aggregateId}_audit_${Date.now()}.txt`;
  const filepath = path.join(OUTPUT_DIR, filename);

  let output = '';
  output += '═══════════════════════════════════════════════\n';
  output += '       AUDITTRAIL - AUDIT REPORT\n';
  output += '═══════════════════════════════════════════════\n\n';
  output += `Container ID: ${aggregateId}\n`;
  output += `Generated:    ${new Date().toISOString()}\n`;
  output += `Total Events: ${data.events.length}\n`;
  output += `Status:       ${data.verification.valid ? '✅ VALID' : '❌ INVALID'}\n\n`;
  output += '───────────────────────────────────────────────\n';
  output += 'EVENT HISTORY\n';
  output += '───────────────────────────────────────────────\n\n';

  data.events.forEach(e => {
    output += `Version ${e.version}: ${e.eventType}\n`;
    output += `  Timestamp: ${new Date(e.timestamp).toISOString()}\n`;
    output += `  Payload:   ${JSON.stringify(e.payload)}\n`;
    output += `  Hash:      ${e.currentHash}\n`;
    output += `  Prev:      ${e.previousHash}\n\n`;
  });

  output += '═══════════════════════════════════════════════\n';
  output += 'INTEGRITY VERIFICATION\n';
  output += '═══════════════════════════════════════════════\n\n';
  output += `Status: ${data.verification.valid ? 'PASSED ✅' : 'FAILED ❌'}\n`;
  if (data.verification.message) {
    output += `Message: ${data.verification.message}\n`;
  }
  output += '\n═══════════════════════════════════════════════\n';

  fs.writeFileSync(filepath, output);
  return filepath;
}

async function exportAuditReport(aggregateId, format = 'json') {
  console.log('═══════════════════════════════════════');
  console.log('📄 Audit Report Export');
  console.log('═══════════════════════════════════════');
  console.log(`   Container: ${aggregateId}`);
  console.log(`   Format:    ${format.toUpperCase()}`);
  console.log('═══════════════════════════════════════\n');

  try {
    await connectDB();
    console.log('✅ Database connected\n');

    // Get events
    const events = await getEventsForAggregate(aggregateId);
    
    if (events.length === 0) {
      console.error(`❌ No events found for ${aggregateId}`);
      process.exit(1);
    }

    console.log(`📝 Found ${events.length} events`);

    // Verify chain
    const verification = await verifyChain(aggregateId);
    console.log(`🔐 Integrity: ${verification.valid ? '✅ VALID' : '❌ INVALID'}\n`);

    // Build report data
    const reportData = {
      aggregateId,
      generatedAt: new Date().toISOString(),
      totalEvents: events.length,
      verification,
      events: events.map(e => ({
        version: e.version,
        eventType: e.eventType,
        timestamp: e.timestamp,
        payload: e.payload,
        metadata: e.metadata,
        currentHash: e.currentHash,
        previousHash: e.previousHash
      }))
    };

    // Export
    let filepath;
    switch (format.toLowerCase()) {
      case 'csv':
        filepath = exportCSV(aggregateId, reportData);
        break;
      case 'txt':
        filepath = exportTXT(aggregateId, reportData);
        break;
      case 'json':
      default:
        filepath = exportJSON(aggregateId, reportData);
        break;
    }

    console.log('═══════════════════════════════════════');
    console.log('✅ Export complete!');
    console.log('═══════════════════════════════════════');
    console.log(`   📄 File: ${filepath}`);
    console.log(`   📦 Size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);
    console.log('═══════════════════════════════════════\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Export failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  const aggregateId = process.argv[2] || 'CTNR-001';
  const format = process.argv[3] || 'json';
  exportAuditReport(aggregateId, format);
}

module.exports = { exportAuditReport };
