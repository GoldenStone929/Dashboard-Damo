/**
 * Universal Block Export Utility
 * 
 * Usage:
 * 1. Include this script and html2canvas in your HTML:
 *    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
 *    <script src="../../assets/js/block-export.js"></script>
 * 
 * 2. Add CSS for export button (or use existing .export-btn styles)
 * 
 * 3. Add export button to any block:
 *    <button class="export-btn" onclick="showBlockExportDialog('blockId', 'Export_Name')">Export</button>
 * 
 * 4. Initialize the dialog once after page loads:
 *    initBlockExportDialog();
 */

// ========================================
// Global State for Block Export
// ========================================
let currentExportBlockId = null;
let currentExportBlockName = null;
let blockExportPrefix = 'Export'; // Can be customized per page

/**
 * Set the export filename prefix (e.g., 'Demographics', 'Labs', etc.)
 * @param {string} prefix - The prefix for exported filenames
 */
function setBlockExportPrefix(prefix) {
  blockExportPrefix = prefix;
}

/**
 * Show export dialog for a block element
 * @param {string} blockId - The ID of the element to export
 * @param {string} blockName - Name for the exported file
 */
function showBlockExportDialog(blockId, blockName) {
  currentExportBlockId = blockId;
  currentExportBlockName = blockName;
  
  // Get actual dimensions of the block
  const block = document.getElementById(blockId);
  if (block) {
    const rect = block.getBoundingClientRect();
    const actualWidth = Math.round(rect.width);
    const actualHeight = Math.round(rect.height);
    
    // Set default values to actual dimensions
    document.getElementById('blockExportWidth').value = actualWidth;
    document.getElementById('blockExportHeight').value = actualHeight;
  }
  
  const overlay = document.getElementById('blockExportDialogOverlay');
  const dialog = document.getElementById('blockExportDialog');
  
  if (overlay) overlay.classList.add('active');
  if (dialog) dialog.classList.add('active');
}

/**
 * Close export dialog
 */
function closeBlockExportDialog() {
  const overlay = document.getElementById('blockExportDialogOverlay');
  const dialog = document.getElementById('blockExportDialog');
  
  if (overlay) overlay.classList.remove('active');
  if (dialog) dialog.classList.remove('active');
  
  currentExportBlockId = null;
  currentExportBlockName = null;
}

/**
 * Export block as PNG image
 */
async function exportBlockImage() {
  if (!currentExportBlockId) {
    alert('Block not found!');
    return;
  }
  
  const block = document.getElementById(currentExportBlockId);
  if (!block || typeof html2canvas !== 'function') {
    alert('Export failed: element not found or html2canvas not loaded.');
    return;
  }
  
  const scale = parseFloat(document.getElementById('blockExportScale').value) || 4;
  
  // Hide export button during capture
  const exportBtn = block.querySelector('.export-btn');
  const prevVisibility = exportBtn ? exportBtn.style.visibility : '';
  if (exportBtn) exportBtn.style.visibility = 'hidden';
  
  try {
    const canvas = await html2canvas(block, {
      backgroundColor: '#ffffff',
      scale: scale,
      useCORS: true,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      onclone: (doc) => {
        // Hide export button in cloned element
        const clonedBlock = doc.getElementById(currentExportBlockId);
        if (clonedBlock) {
          const clonedBtn = clonedBlock.querySelector('.export-btn');
          if (clonedBtn) clonedBtn.style.display = 'none';
        }
      }
    });
    
    // Add disclaimer at bottom of image
    const disclaimerText = "PRELIMINARY DATA – Subject to Quality Control Review | For Authorized Internal Use Only | Not for External Distribution, Discussion, or Regulatory Submission";
    const disclaimerHeight = 35 * scale;
    
    // Create new canvas with space for disclaimer
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height + disclaimerHeight;
    
    const ctx = finalCanvas.getContext('2d');
    
    // Fill background white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    
    // Draw original content
    ctx.drawImage(canvas, 0, 0);
    
    // Draw disclaimer text in red at bottom
    ctx.fillStyle = '#cc0000';
    ctx.font = `bold ${15 * scale}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(disclaimerText, finalCanvas.width / 2, canvas.height + disclaimerHeight / 2);
    
    // Create download link
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `${blockExportPrefix}_${currentExportBlockName}_${timestamp}.png`;
    link.href = finalCanvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    closeBlockExportDialog();
  } catch (error) {
    console.error('Export error:', error);
    alert('Error exporting block: ' + error.message);
  } finally {
    // Restore export button visibility
    if (exportBtn) exportBtn.style.visibility = prevVisibility;
  }
}

/**
 * Initialize export dialog HTML (call this once per page)
 * Creates the dialog and overlay elements if they don't exist
 */
function initBlockExportDialog() {
  // Check if dialog already exists
  if (document.getElementById('blockExportDialog')) {
    return;
  }
  
  // Add required CSS styles if not already present
  if (!document.getElementById('blockExportStyles')) {
    const style = document.createElement('style');
    style.id = 'blockExportStyles';
    style.textContent = `
      .export-btn { 
        background: #dc3545 !important; 
        color: white !important; 
        border: none !important; 
        padding: 6px 12px !important; 
        border-radius: 4px !important; 
        cursor: pointer !important; 
        font-size: 12px !important; 
        font-weight: bold !important;
        transition: background 0.2s; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
      }
      .export-btn:hover { background: #c82333 !important; }
      
      .chart-export-dialog { 
        display: none; position: fixed; z-index: 1000; left: 50%; top: 50%; 
        transform: translate(-50%, -50%); background: white; padding: 20px; 
        border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); 
        min-width: 300px; 
      }
      .chart-export-dialog.active { display: block; }
      .chart-export-dialog h3 { margin-top: 0; margin-bottom: 15px; border: none; }
      .chart-export-dialog .form-group { margin-bottom: 15px; }
      .chart-export-dialog label { display: block; margin-bottom: 5px; font-weight: bold; }
      .chart-export-dialog input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
      .chart-export-dialog .button-group { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
      .chart-export-dialog button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
      .chart-export-dialog .btn-primary { background: #4285f4; color: white; }
      .chart-export-dialog .btn-primary:hover { background: #3367d6; }
      .chart-export-dialog .btn-secondary { background: #e0e0e0; color: #333; }
      .chart-export-dialog .btn-secondary:hover { background: #d0d0d0; }
      .chart-export-dialog-overlay {
        display: none; position: fixed; z-index: 999; left: 0; top: 0; 
        width: 100%; height: 100%; background: rgba(0,0,0,0.5);
      }
      .chart-export-dialog-overlay.active { display: block; }
    `;
    document.head.appendChild(style);
  }
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'blockExportDialogOverlay';
  overlay.className = 'chart-export-dialog-overlay';
  overlay.onclick = closeBlockExportDialog;
  document.body.appendChild(overlay);
  
  // Create dialog
  const dialog = document.createElement('div');
  dialog.id = 'blockExportDialog';
  dialog.className = 'chart-export-dialog';
  dialog.innerHTML = `
    <h3>Export Block as Image</h3>
    <div class="form-group">
      <label for="blockExportWidth">Width (pixels):</label>
      <input type="number" id="blockExportWidth" value="800" min="100" max="10000" step="1" readonly style="background:#f0f0f0;">
    </div>
    <div class="form-group">
      <label for="blockExportHeight">Height (pixels):</label>
      <input type="number" id="blockExportHeight" value="600" min="100" max="10000" step="1" readonly style="background:#f0f0f0;">
    </div>
    <div class="form-group">
      <label for="blockExportScale">Resolution Scale (1-4, higher = clearer):</label>
      <input type="number" id="blockExportScale" value="4" min="1" max="4" step="0.5">
    </div>
    <div class="button-group">
      <button class="btn-secondary" onclick="closeBlockExportDialog()">Cancel</button>
      <button class="btn-primary" onclick="exportBlockImage()">Export</button>
    </div>
  `;
  document.body.appendChild(dialog);
}
