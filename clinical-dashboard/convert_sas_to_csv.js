/**
 * Convert SAS7BDAT file to CSV format (Node.js version)
 * 
 * This script converts dm.sas7bdat to dm.CSV in the data directory.
 * 
 * Requirements:
 *   npm install sas7bdat csv-writer
 * 
 * Usage:
 *   node convert_sas_to_csv.js
 */

const fs = require('fs');
const path = require('path');
const SAS7BDAT = require('sas7bdat');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const INPUT_FILE = path.join(__dirname, 'data', 'dm.sas7bdat');
const OUTPUT_FILE = path.join(__dirname, 'data', 'dm.CSV');

async function convertSasToCsv() {
  try {
    // Check if input file exists
    if (!fs.existsSync(INPUT_FILE)) {
      console.error(`Error: Input file not found: ${INPUT_FILE}`);
      return false;
    }

    console.log(`Reading SAS7BDAT file: ${INPUT_FILE}`);
    
    // Read SAS7BDAT file
    const reader = new SAS7BDAT(INPUT_FILE);
    const data = await reader.read();
    
    console.log(`Loaded ${data.length} rows and ${data.columns.length} columns`);
    console.log(`Columns: ${data.columns.slice(0, 10).join(', ')}${data.columns.length > 10 ? '...' : ''}`);
    
    // Prepare CSV writer
    const csvWriter = createCsvWriter({
      path: OUTPUT_FILE,
      header: data.columns.map(col => ({ id: col, title: col }))
    });
    
    // Write to CSV
    console.log(`Writing CSV file: ${OUTPUT_FILE}`);
    await csvWriter.writeRecords(data.rows);
    
    console.log(`✓ Successfully converted dm.sas7bdat to dm.CSV`);
    console.log(`  Output: ${OUTPUT_FILE}`);
    return true;
    
  } catch (error) {
    console.error(`Error converting file: ${error.message}`);
    console.error(error.stack);
    return false;
  }
}

// Run conversion
convertSasToCsv()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });

