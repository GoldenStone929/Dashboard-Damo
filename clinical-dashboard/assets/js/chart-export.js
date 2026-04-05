/**
 * Universal Chart Export Utility
 * Usage: Call showChartExportDialog(chartId, chartName, state) from any file
 */

// Global state for export dialog
let currentExportChartId = null;
let currentExportChartName = null;
let currentExportState = null;

/**
 * Show export dialog for a chart
 * @param {string} chartId - The canvas/chart ID
 * @param {string} chartName - Name for the exported file
 * @param {object} state - Application state object (must have charts and currentPatient)
 */
function showChartExportDialog(chartId, chartName, state) {
  currentExportChartId = chartId;
  currentExportChartName = chartName;
  currentExportState = state;
  
  const overlay = document.getElementById('chartExportDialogOverlay');
  const dialog = document.getElementById('chartExportDialog');
  
  // Auto-adjust default width/height based on actual chart dimensions
  if (state && state.charts && state.charts[chartId]) {
    const chart = state.charts[chartId];
    const chartWidth = chart.width || 800;
    const chartHeight = chart.height || 600;
    
    // Set default export dimensions (use chart's actual size, scaled up for better quality)
    const widthInput = document.getElementById('chartExportWidth');
    const heightInput = document.getElementById('chartExportHeight');
    
    if (widthInput) widthInput.value = chartWidth;
    if (heightInput) heightInput.value = chartHeight;
  }
  
  if (overlay) overlay.classList.add('active');
  if (dialog) dialog.classList.add('active');
}

/**
 * Close export dialog
 */
function closeChartExportDialog() {
  const overlay = document.getElementById('chartExportDialogOverlay');
  const dialog = document.getElementById('chartExportDialog');
  
  if (overlay) overlay.classList.remove('active');
  if (dialog) dialog.classList.remove('active');
  
  currentExportChartId = null;
  currentExportChartName = null;
  currentExportState = null;
}

/**
 * Export chart as image with white background
 */
function exportChartImage() {
  if (!currentExportChartId || !currentExportState || !currentExportState.charts[currentExportChartId]) {
    alert('Chart not found!');
    return;
  }

  const chart = currentExportState.charts[currentExportChartId];
  const width = parseInt(document.getElementById('chartExportWidth').value) || 2400;
  const height = parseInt(document.getElementById('chartExportHeight').value) || 1800;
  const scale = parseFloat(document.getElementById('chartExportScale').value) || 2;

  // Get original chart dimensions
  const originalWidth = chart.width;
  const originalHeight = chart.height;

  // Disclaimer settings
  const disclaimerText = "PRELIMINARY DATA – Subject to Quality Control Review | For Authorized Internal Use Only | Not for External Distribution, Discussion, or Regulatory Submission";
  const disclaimerHeight = 35 * scale;

  try {
    // Temporarily resize chart for export
    chart.resize(width, height);
    
    // Wait for chart to update
    setTimeout(() => {
      // Create a temporary canvas with white background (extra height for disclaimer)
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width * scale;
      tempCanvas.height = height * scale + disclaimerHeight;
      const tempCtx = tempCanvas.getContext('2d');
      
      // Fill with white background
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Get chart image data
      const chartImageData = chart.toBase64Image('image/png', scale);
      
      // Create image from chart data
      const img = new Image();
      img.onload = function() {
        // Draw chart image on white background
        tempCtx.drawImage(img, 0, 0, width * scale, height * scale);
        
        // Draw disclaimer text in red at bottom
        tempCtx.fillStyle = '#cc0000';
        tempCtx.font = `bold ${15 * scale}px Arial, sans-serif`;
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText(disclaimerText, tempCanvas.width / 2, height * scale + disclaimerHeight / 2);
        
        // Convert to base64 with white background
        const imageData = tempCanvas.toDataURL('image/png');
        
        // Restore original chart size
        chart.resize(originalWidth, originalHeight);
        
        // Create download link
        const link = document.createElement('a');
        const patientId = currentExportState.currentPatient || 'patient';
        const timestamp = new Date().toISOString().slice(0, 10);
        link.download = `${patientId}_${currentExportChartName}_${timestamp}.png`;
        link.href = imageData;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        closeChartExportDialog();
      };
      img.onerror = function() {
        console.error('Error loading chart image');
        alert('Error exporting chart');
        chart.resize(originalWidth, originalHeight);
      };
      img.src = chartImageData;
    }, 100);
  } catch (error) {
    console.error('Export error:', error);
    alert('Error exporting chart: ' + error.message);
    // Restore original size on error
    chart.resize(originalWidth, originalHeight);
  }
}

/**
 * Initialize export dialog HTML (call this once per page)
 * This creates the dialog HTML if it doesn't exist
 */
function initChartExportDialog() {
  // Check if dialog already exists
  if (document.getElementById('chartExportDialog')) {
    return;
  }
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'chartExportDialogOverlay';
  overlay.className = 'chart-export-dialog-overlay';
  overlay.onclick = closeChartExportDialog;
  document.body.appendChild(overlay);
  
  // Create dialog
  const dialog = document.createElement('div');
  dialog.id = 'chartExportDialog';
  dialog.className = 'chart-export-dialog';
  dialog.innerHTML = `
    <h3>Export Chart as Image</h3>
    <div class="form-group">
      <label for="chartExportWidth">Width (pixels):</label>
      <input type="number" id="chartExportWidth" value="1800" min="100" max="10000" step="100">
    </div>
    <div class="form-group">
      <label for="chartExportHeight">Height (pixels):</label>
      <input type="number" id="chartExportHeight" value="2400" min="100" max="10000" step="100">
    </div>
    <div class="form-group">
      <label for="chartExportScale">Resolution Scale (1-4, higher = clearer):</label>
      <input type="number" id="chartExportScale" value="4" min="1" max="4" step="0.5">
    </div>
    <div class="button-group">
      <button class="btn-secondary" onclick="closeChartExportDialog()">Cancel</button>
      <button class="btn-primary" onclick="exportChartImage()">Export</button>
    </div>
  `;
  document.body.appendChild(dialog);
}

