/**
 * Universal PDF Document Export Utility
 * 
 * Exports multiple charts/elements to a PDF document
 * Each chart is captured as an image and placed on a separate page
 * 
 * Dependencies:
 * - html2canvas: For capturing DOM elements as images
 * - jsPDF: For creating PDF documents
 * 
 * Usage:
 * 1. Include dependencies in your HTML:
 *    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
 *    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
 *    <script src="../../assets/js/pdf-export.js"></script>
 * 
 * 2. Add export button:
 *    <button class="export-pdf-btn" onclick="exportChartsToPDF('containerId', 'filename')">Export to PDF</button>
 * 
 * 3. Charts should be in elements with class 'chart-card' or specify custom selector
 */

// ========================================
// PDF Export Configuration
// ========================================
const PDF_EXPORT_CONFIG = {
  // Wide Landscape layout for chart + table side by side
  pageWidthInches: 15.4,  // Same as Word export
  pageHeightInches: 8,    // Same as Word export
  marginInches: 0.25,     // Minimal margins
  imageScale: 2,          // Reduced scale to avoid string length issues
  imageQuality: 0.92,     // JPEG quality (0-1)
  disclaimer: "PRELIMINARY DATA – Subject to Quality Control Review | For Authorized Internal Use Only | Not for External Distribution, Discussion, or Regulatory Submission",
  
  // Computed values in points (1 inch = 72 points for PDF)
  get pageWidthPt() { return this.pageWidthInches * 72; },
  get pageHeightPt() { return this.pageHeightInches * 72; },
  get marginPt() { return this.marginInches * 72; },
  // Usable content area in points
  get contentWidthPt() { return (this.pageWidthInches - 2 * this.marginInches) * 72; },
  get contentHeightPt() { return (this.pageHeightInches - 2 * this.marginInches) * 72 - 30; } // Reserve space for header/footer
};

/**
 * Export all charts in a container to a PDF document
 * @param {string} containerId - ID of the container with charts
 * @param {string} filename - Base filename for the exported document
 * @param {string} chartSelector - CSS selector for chart elements (default: '.chart-card')
 */
async function exportChartsToPDF(containerId, filename, chartSelector = '.chart-card') {
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

  // Check if jsPDF library is loaded
  if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
    alert('PDF export library not loaded. Please refresh the page and try again.');
    return;
  }

  // Show progress indicator
  const progressOverlay = showPDFExportProgress(charts.length);
  let chartsAdded = 0;

  try {
    // Get jsPDF constructor
    const { jsPDF } = window.jspdf || { jsPDF: window.jsPDF };
    
    // Create PDF with custom page size (landscape)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [PDF_EXPORT_CONFIG.pageWidthPt, PDF_EXPORT_CONFIG.pageHeightPt]
    });

    // Capture all charts as images
    for (let i = 0; i < charts.length; i++) {
      updatePDFExportProgress(progressOverlay, i + 1, charts.length, 'Capturing chart ' + (i + 1));
      
      const chart = charts[i];
      
      // Hide any export buttons in the chart
      const exportBtns = chart.querySelectorAll('.export-btn, .export-word-btn, .export-pdf-btn');
      exportBtns.forEach(btn => btn.style.visibility = 'hidden');
      
      try {
        // Try with configured scale, fallback to lower if needed
        let canvas;
        let currentScale = PDF_EXPORT_CONFIG.imageScale;
        
        try {
          canvas = await html2canvas(chart, {
            backgroundColor: '#ffffff',
            scale: currentScale,
            useCORS: true,
            logging: false
          });
        } catch (canvasError) {
          // If failed, try with lower scale
          console.warn('Retrying with lower scale for chart', i + 1);
          currentScale = 1;
          canvas = await html2canvas(chart, {
            backgroundColor: '#ffffff',
            scale: currentScale,
            useCORS: true,
            logging: false
          });
        }
        
        // Convert canvas to JPEG with compression
        // Try progressively lower quality if string is too large
        let imgData;
        let quality = PDF_EXPORT_CONFIG.imageQuality;
        
        while (quality >= 0.5) {
          try {
            imgData = canvas.toDataURL('image/jpeg', quality);
            // Test if string is valid by checking length
            if (imgData.length < 50 * 1024 * 1024) { // Less than 50MB
              break;
            }
            quality -= 0.1;
          } catch (e) {
            quality -= 0.1;
          }
        }
        
        if (!imgData) {
          console.error('Failed to convert chart', i + 1, 'to image');
          continue;
        }
        
        // Calculate dimensions to fit page
        const imgWidth = canvas.width / currentScale;
        const imgHeight = canvas.height / currentScale;
        const aspectRatio = imgWidth / imgHeight;
        
        // Scale to fit content area
        let displayWidth = PDF_EXPORT_CONFIG.contentWidthPt;
        let displayHeight = displayWidth / aspectRatio;
        
        // If too tall, scale based on height
        if (displayHeight > PDF_EXPORT_CONFIG.contentHeightPt) {
          displayHeight = PDF_EXPORT_CONFIG.contentHeightPt;
          displayWidth = displayHeight * aspectRatio;
        }
        
        // Center the image on the page
        const xOffset = PDF_EXPORT_CONFIG.marginPt + (PDF_EXPORT_CONFIG.contentWidthPt - displayWidth) / 2;
        const yOffset = PDF_EXPORT_CONFIG.marginPt + 15; // 15pt for header space
        
        // Add new page for subsequent charts
        if (chartsAdded > 0) {
          pdf.addPage([PDF_EXPORT_CONFIG.pageWidthPt, PDF_EXPORT_CONFIG.pageHeightPt], 'landscape');
        }
        
        // Add header
        pdf.setFontSize(9);
        pdf.setTextColor(102, 102, 102);
        const headerText = `${filename.replace(/_/g, ' ')} - Generated ${new Date().toLocaleDateString()}`;
        pdf.text(headerText, PDF_EXPORT_CONFIG.pageWidthPt - PDF_EXPORT_CONFIG.marginPt, PDF_EXPORT_CONFIG.marginPt, { align: 'right' });
        
        // Add image (use JPEG format)
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, displayWidth, displayHeight);
        
        // Add footer with disclaimer
        pdf.setFontSize(7);
        pdf.setTextColor(204, 0, 0);
        const footerY = PDF_EXPORT_CONFIG.pageHeightPt - PDF_EXPORT_CONFIG.marginPt + 5;
        pdf.text(PDF_EXPORT_CONFIG.disclaimer, PDF_EXPORT_CONFIG.pageWidthPt / 2, footerY, { align: 'center' });
        
        chartsAdded++;
        
        // Clear memory after each chart
        canvas = null;
        imgData = null;
        
      } catch (chartError) {
        console.error('Error processing chart', i + 1, ':', chartError);
        // Continue with next chart
      } finally {
        // Restore export buttons
        exportBtns.forEach(btn => btn.style.visibility = '');
      }
      
      // Small delay to allow garbage collection
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (chartsAdded === 0) {
      throw new Error('No charts could be exported');
    }

    updatePDFExportProgress(progressOverlay, charts.length, charts.length, 'Generating PDF...');

    // Save the PDF
    const timestamp = new Date().toISOString().slice(0, 10);
    pdf.save(`${filename}_${timestamp}.pdf`);

    hidePDFExportProgress(progressOverlay);
    
  } catch (error) {
    console.error('PDF export error:', error);
    hidePDFExportProgress(progressOverlay);
    alert('Error exporting to PDF: ' + error.message);
  }
}

/**
 * Show PDF export progress overlay
 */
function showPDFExportProgress(totalCharts) {
  // Remove existing overlay if any
  const existing = document.getElementById('pdfExportProgressOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'pdfExportProgressOverlay';
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
        Exporting to PDF Document
      </div>
      <div id="pdfExportProgressText" style="font-size: 14px; color: #666; margin-bottom: 15px;">
        Preparing export...
      </div>
      <div style="
        width: 100%;
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
      ">
        <div id="pdfExportProgressBar" style="
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, #dc2626, #f97316);
          transition: width 0.3s ease;
        "></div>
      </div>
      <div id="pdfExportProgressCount" style="font-size: 12px; color: #999; margin-top: 10px;">
        0 / ${totalCharts} charts
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Update PDF export progress
 */
function updatePDFExportProgress(overlay, current, total, message) {
  if (!overlay) return;
  
  const progressBar = overlay.querySelector('#pdfExportProgressBar');
  const progressText = overlay.querySelector('#pdfExportProgressText');
  const progressCount = overlay.querySelector('#pdfExportProgressCount');
  
  const percent = Math.round((current / total) * 100);
  
  if (progressBar) progressBar.style.width = percent + '%';
  if (progressText) progressText.textContent = message;
  if (progressCount) progressCount.textContent = `${current} / ${total} charts`;
}

/**
 * Hide PDF export progress overlay
 */
function hidePDFExportProgress(overlay) {
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    setTimeout(() => overlay.remove(), 300);
  }
}

/**
 * Add PDF export button styles
 */
function initPDFExportStyles() {
  if (document.getElementById('pdfExportStyles')) return;
  
  const style = document.createElement('style');
  style.id = 'pdfExportStyles';
  style.textContent = `
    .export-pdf-btn {
      background: linear-gradient(135deg, #dc2626, #ef4444) !important;
      color: white !important;
      border: none !important;
      padding: 8px 16px !important;
      border-radius: 6px !important;
      cursor: pointer !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      transition: all 0.2s ease !important;
      box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3) !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
    }
    .export-pdf-btn:hover {
      background: linear-gradient(135deg, #b91c1c, #dc2626) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4) !important;
    }
    .export-pdf-btn:active {
      transform: translateY(0) !important;
    }
    .export-pdf-btn::before {
      content: '📕';
      font-size: 14px;
    }
  `;
  document.head.appendChild(style);
}

// Auto-initialize styles when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPDFExportStyles);
} else {
  initPDFExportStyles();
}
