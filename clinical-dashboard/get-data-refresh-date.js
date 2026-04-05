const fs = require('fs');
const path = require('path');

// Directory containing data files
const dataDir = path.join(__dirname, 'data');

// Get all CSV files in the data directory
function getCSVFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.csv' || (ext === '' && file.toUpperCase().endsWith('.CSV'));
  });
}

// Get the most recent modification date from all CSV files
function getMostRecentDate() {
  try {
    const csvFiles = getCSVFiles(dataDir);
    let mostRecentDate = null;

    csvFiles.forEach(file => {
      const filePath = path.join(dataDir, file);
      try {
        const stats = fs.statSync(filePath);
        const modifiedDate = stats.mtime;
        
        if (!mostRecentDate || modifiedDate > mostRecentDate) {
          mostRecentDate = modifiedDate;
        }
      } catch (err) {
        console.error(`Error reading ${file}:`, err.message);
      }
    });

    return mostRecentDate;
  } catch (err) {
    console.error('Error reading data directory:', err.message);
    return null;
  }
}

// Generate JSON file with the refresh date
function generateRefreshDateFile() {
  const mostRecentDate = getMostRecentDate();
  
  if (mostRecentDate) {
    const dateInfo = {
      refreshDate: mostRecentDate.toISOString(),
      formattedDate: mostRecentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }),
      timestamp: mostRecentDate.getTime()
    };

    const outputPath = path.join(__dirname, 'data', 'refresh-date.json');
    fs.writeFileSync(outputPath, JSON.stringify(dateInfo, null, 2));
    console.log(`Data refresh date updated: ${dateInfo.formattedDate}`);
    console.log(`File saved to: ${outputPath}`);
  } else {
    console.error('Could not determine data refresh date');
  }
}

// Run the script
generateRefreshDateFile();

