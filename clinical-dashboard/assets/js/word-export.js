/**
 * Universal Word Document Export Utility
 * 
 * Exports multiple charts/elements to a Word document (.docx)
 * Each chart is captured as an image and placed on a separate page
 * 
 * Dependencies:
 * - html2canvas: For capturing DOM elements as images
 * - docx: For creating Word documents
 * 
 * Usage:
 * 1. Include dependencies in your HTML:
 *    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
 *    <script src="https://unpkg.com/docx@8.2.2/build/index.umd.js"></script>
 *    <script src="../../assets/js/word-export.js"></script>
 * 
 * 2. Add export button:
 *    <button class="export-word-btn" onclick="exportChartsToWord('containerId', 'filename')">Export to Word</button>
 * 
 * 3. Charts should be in elements with class 'chart-card' or specify custom selector
 */

// ========================================
// Word Export Configuration
// ========================================
const WORD_EXPORT_CONFIG = {
  // Wide Landscape layout for chart + table side by side
  // 1 inch = 1440 twips, 1 inch = 96 pixels (at 96 DPI)
  pageWidthInches: 15.4,  // 15.4 inches wide (+10% from 14)
  pageHeightInches: 8,    // 8 inches tall (-20% from 10)
  marginInches: 0.25,     // 0.25 inch margins (minimal to maximize content area)
  imageScale: 3,          // Higher scale for best resolution
  disclaimer: "PRELIMINARY DATA – Subject to Quality Control Review | For Authorized Internal Use Only | Not for External Distribution, Discussion, or Regulatory Submission",
  
  // Computed values (in twips: 1 inch = 1440 twips)
  get pageWidth() { return this.pageWidthInches * 1440; },
  get pageHeight() { return this.pageHeightInches * 1440; },
  get margins() {
    const m = this.marginInches * 1440;
    return { top: m, bottom: m, left: m, right: m };
  },
  // Usable content area in pixels (at 96 DPI)
  get contentWidthPx() { return (this.pageWidthInches - 2 * this.marginInches) * 96; },
  get contentHeightPx() { return (this.pageHeightInches - 2 * this.marginInches) * 96 - 60; } // Reserve space for header/footer
};

/**
 * Export all charts in a container to a Word document
 * @param {string} containerId - ID of the container with charts
 * @param {string} filename - Base filename for the exported document
 * @param {string} chartSelector - CSS selector for chart elements (default: '.chart-card')
 */
async function exportChartsToWord(containerId, filename, chartSelector = '.chart-card') {
  const container = document.getElementById(containerId);
  if (!container) {
    alert('Container not found!');
    return;
  }

  const charts = container.querySelectorAll(chartSelector);
  if (charts.length === 0) {
    alert('No charts found to export!');
    return;
  }

  // Check if docx library is loaded
  if (typeof docx === 'undefined') {
    alert('Word export library not loaded. Please refresh the page and try again.');
    return;
  }

  // Show progress indicator
  const progressOverlay = showExportProgress(charts.length);

  try {
    const { Document, Packer, Paragraph, TextRun, ImageRun, PageBreak, AlignmentType, Header, Footer } = docx;

    // Capture all charts as images
    const chartImages = [];
    for (let i = 0; i < charts.length; i++) {
      updateExportProgress(progressOverlay, i + 1, charts.length, 'Capturing chart ' + (i + 1));
      
      const chart = charts[i];
      
      // Hide any export buttons in the chart
      const exportBtns = chart.querySelectorAll('.export-btn, .export-word-btn');
      exportBtns.forEach(btn => btn.style.visibility = 'hidden');
      
      try {
        const canvas = await html2canvas(chart, {
          backgroundColor: '#ffffff',
          scale: WORD_EXPORT_CONFIG.imageScale,
          useCORS: true,
          logging: false
        });
        
        // Convert canvas to base64 for docx library
        const base64Data = canvas.toDataURL('image/png').split(',')[1];
        
        // Get chart title if available
        const titleEl = chart.querySelector('.chart-title');
        const subtitleEl = chart.querySelector('.chart-subtitle');
        let title = titleEl ? titleEl.textContent : `Chart ${i + 1}`;
        if (subtitleEl) title += ' - ' + subtitleEl.textContent;
        
        chartImages.push({
          data: base64Data,
          width: canvas.width / WORD_EXPORT_CONFIG.imageScale, // Original pixel width
          height: canvas.height / WORD_EXPORT_CONFIG.imageScale, // Original pixel height
          title: title
        });
      } finally {
        // Restore export buttons
        exportBtns.forEach(btn => btn.style.visibility = '');
      }
    }

    updateExportProgress(progressOverlay, charts.length, charts.length, 'Generating Word document...');

    // Use computed content area from config (page size minus margins)
    const maxWidth = WORD_EXPORT_CONFIG.contentWidthPx;
    const maxHeight = WORD_EXPORT_CONFIG.contentHeightPx;

    // Create document sections (one chart per page)
    const children = [];
    
    chartImages.forEach((img, idx) => {
      // Calculate scaled dimensions to fit page perfectly
      const aspectRatio = img.width / img.height;
      
      // Try to fill the width first
      let displayWidth = maxWidth;
      let displayHeight = displayWidth / aspectRatio;
      
      // If too tall, scale based on height instead
      if (displayHeight > maxHeight) {
        displayHeight = maxHeight;
        displayWidth = displayHeight * aspectRatio;
      }

      // Add chart image (no separate title needed - info is in the chart itself)
      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: Uint8Array.from(atob(img.data), c => c.charCodeAt(0)),
              transformation: {
                width: Math.round(displayWidth),
                height: Math.round(displayHeight)
              }
            })
          ],
          alignment: AlignmentType.CENTER
        })
      );

      // Add page break except for last chart
      if (idx < chartImages.length - 1) {
        children.push(
          new Paragraph({
            children: [new PageBreak()]
          })
        );
      }
    });

    // Create the document with wide landscape layout
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: {
              // For landscape: width > height
              width: WORD_EXPORT_CONFIG.pageWidth,
              height: WORD_EXPORT_CONFIG.pageHeight
            },
            margin: WORD_EXPORT_CONFIG.margins
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${filename.replace(/_/g, ' ')} - Generated ${new Date().toLocaleDateString()}`,
                    size: 18,
                    color: '666666'
                  })
                ],
                alignment: AlignmentType.RIGHT
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: WORD_EXPORT_CONFIG.disclaimer,
                    size: 14,
                    color: 'CC0000',
                    bold: true
                  })
                ],
                alignment: AlignmentType.CENTER
              })
            ]
          })
        },
        children: children
      }]
    });

    // Generate and download the document
    const docBlob = await Packer.toBlob(doc);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadBlob(docBlob, `${filename}_${timestamp}.docx`);

    hideExportProgress(progressOverlay);
    
  } catch (error) {
    console.error('Word export error:', error);
    hideExportProgress(progressOverlay);
    alert('Error exporting to Word: ' + error.message);
  }
}

/**
 * Download a blob as a file
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Show export progress overlay
 */
function showExportProgress(totalCharts) {
  // Remove existing overlay if any
  const existing = document.getElementById('wordExportProgressOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'wordExportProgressOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

  overlay.innerHTML = `
    <div style="
      background: white;
      padding: 30px 50px;
      border-radius: 12px;
      text-align: center;
      min-width: 300px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    ">
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333;">
        Exporting to Word Document
      </div>
      <div id="wordExportProgressText" style="font-size: 14px; color: #666; margin-bottom: 15px;">
        Preparing export...
      </div>
      <div style="
        width: 100%;
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
      ">
        <div id="wordExportProgressBar" style="
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #22c55e);
          transition: width 0.3s ease;
        "></div>
      </div>
      <div id="wordExportProgressCount" style="font-size: 12px; color: #999; margin-top: 10px;">
        0 / ${totalCharts} charts
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Update export progress
 */
function updateExportProgress(overlay, current, total, message) {
  if (!overlay) return;
  
  const progressBar = overlay.querySelector('#wordExportProgressBar');
  const progressText = overlay.querySelector('#wordExportProgressText');
  const progressCount = overlay.querySelector('#wordExportProgressCount');
  
  const percent = Math.round((current / total) * 100);
  
  if (progressBar) progressBar.style.width = percent + '%';
  if (progressText) progressText.textContent = message;
  if (progressCount) progressCount.textContent = `${current} / ${total} charts`;
}

/**
 * Hide export progress overlay
 */
function hideExportProgress(overlay) {
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    setTimeout(() => overlay.remove(), 300);
  }
}

/**
 * Add Word export button styles
 */
function initWordExportStyles() {
  if (document.getElementById('wordExportStyles')) return;
  
  const style = document.createElement('style');
  style.id = 'wordExportStyles';
  style.textContent = `
    .export-word-btn {
      background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
      color: white !important;
      border: none !important;
      padding: 8px 16px !important;
      border-radius: 6px !important;
      cursor: pointer !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      transition: all 0.2s ease !important;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3) !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
    }
    .export-word-btn:hover {
      background: linear-gradient(135deg, #1d4ed8, #2563eb) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4) !important;
    }
    .export-word-btn:active {
      transform: translateY(0) !important;
    }
    .export-word-btn::before {
      content: '📄';
      font-size: 14px;
    }
  `;
  document.head.appendChild(style);
}

// Auto-initialize styles when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWordExportStyles);
} else {
  initWordExportStyles();
}
