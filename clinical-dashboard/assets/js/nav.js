/**
 * Clinical Dashboard - Global Navigation
 */

const NAV_STRUCTURE = [
  {
    id: 'study-overview',
    label: 'Study Overview',
    items: [
      { id: 'summary', label: 'Study Summary', href: 'sections/study-overview/summary.html' },
      { id: 'demographics', label: 'Demographics', href: 'sections/study-overview/demographics.html' },
      { id: 'enrollment', label: 'Enrollment & Disposition', href: 'sections/study-overview/enrollment.html' },
      { id: 'dose-cohorts', label: 'Dose Cohorts Overview', href: 'sections/study-overview/dose-cohorts.html' },
      { id: 'icf-screening', label: 'ICF & Screening', href: 'sections/study-overview/icf-screening.html' },
      { id: 'medical-history', label: 'Medical History', href: 'sections/study-overview/medical-history.html' },
      { id: 'eot-eos', label: 'EOT / EOS Details', href: 'sections/study-overview/eot-eos.html' }
    ]
  },
  {
    id: 'patients',
    label: 'Patient Profiles',
    items: [
      { id: 'patient-list', label: 'Patient List', href: 'sections/patients/patient-list.html' },
      { type: 'divider' },
      { type: 'header', label: 'Patient Clinical Profile' },
      { id: 'pp-summary', label: 'Clinical Summary', href: 'sections/patients/patient-profile/summary.html' },
      { id: 'pp-medical-history', label: 'Medical History', href: 'sections/patients/patient-profile/medical-history.html' },
      { id: 'pp-cm-prior-tx', label: 'Prior Cancer Therapy', href: 'sections/patients/patient-profile/cm-prior-tx.html' },
      { id: 'pp-cm-timeline', label: 'Concomitant Medications Timeline', href: 'sections/patients/patient-profile/cm-timeline.html' },
      { id: 'pp-visits', label: 'Visit Schedule & Status', href: 'sections/patients/patient-profile/visits.html' },
      { id: 'pp-visit-compliance', label: 'Visit Compliance', href: 'sections/patients/patient-profile/visit-compliance.html' },
      { id: 'pp-dosing-history', label: 'Dosing History', href: 'sections/patients/patient-profile/dosing-history.html' },
      { id: 'pp-dose-ae-lab', label: 'Dose-AE-Lab Timeline (Normalized)', href: 'sections/patients/patient-profile/dose-ae-lab.html' },
      { id: 'pp-dose-ae-lab-absolute', label: 'Dose-AE-Lab Timeline (Absolute)', href: 'sections/patients/patient-profile/dose-ae-lab-absolute.html' },
      { id: 'pp-ae-teae', label: 'Adverse Events (AE/TEAE)', href: 'sections/patients/patient-profile/ae-teae.html' },
      { id: 'pp-vitals', label: 'Vital Signs', href: 'sections/patients/patient-profile/vitals.html' },
      { id: 'pp-ecg', label: 'ECG / QTcF', href: 'sections/patients/patient-profile/ecg-qtcf.html' },
      { id: 'pp-labs', label: 'Laboratory Results', href: 'sections/patients/patient-profile/labs.html' },    ]
  },
  {
    id: 'safety',
    label: 'Safety',
    items: [
      { id: 'safety-dashboard', label: 'Safety Dashboard', href: 'sections/safety/dashboard.html' },
      { id: 'ae-summary-table', label: 'AE Summary', href: 'sections/safety/ae_summary_table.html' },
      { id: 'ae-detail', label: 'AE Patient Listing', href: 'sections/safety/ae-detail.html' },
      { type: 'divider' },
      { type: 'header', label: 'TEAE Analysis' },
      { id: 'teae-table', label: 'TEAE Patient Listing', href: 'sections/safety/teae-table.html' },
      { id: 'teae-overview', label: 'TEAE Overview (Event-Level)', href: 'sections/safety/index.html' },
      { id: 'teae-subject-overview', label: 'TEAE Overview (Subject-Level)', href: 'sections/safety/teae-subject.html' },
      { id: 'teae-related-nonrelated', label: 'TEAE Relatedness Split (Event-Level)', href: 'sections/safety/teae-related-nonrelated.html' },
      { id: 'teae-subject-related-nonrelated', label: 'TEAE Relatedness Split (Subject-Level)', href: 'sections/safety/teae-subject-related-nonrelated.html' },
      { id: 'teae-analysis', label: 'TEAE Analysis Dashboard', href: 'sections/safety/teae-analysis.html' },
      { type: 'divider' },
      { type: 'header', label: 'Hepatic Safety' },
      { id: 'bilirubin', label: 'Bilirubin CTCAE Grading', href: 'sections/safety/bilirubin.html' },
      { id: 'max-bilirubin-treatment', label: 'Maximum Bilirubin by Treatment', href: 'sections/safety/max-bilirubin-treatment.html' },
    ]
  },
  {
    id: 'labs',
    label: 'Labs',
    items: [
      // Original & Normalized Lab Values
      { id: 'lab-original', label: 'Lab Original Values', href: 'sections/labs/lab-original.html' },
      { id: 'lab-uln-lln', label: 'Lab Normalized (ULN/LLN)', href: 'sections/labs/normalized.html' },
      { id: 'lab-normalized', label: 'Lab Normalized - By Patient', href: 'sections/labs/lab-normalized.html' },
      // CTCAE Grading
      { id: 'ctcae-labs', label: 'CTCAE Labs (By Patient)', href: 'sections/labs/ctcae-labs.html' },
      { id: 'ctcae', label: 'CTCAE Labs (All Patients)', href: 'sections/labs/CTCAE.html' },
      { id: 'ctcae-grade-summary', label: 'CTCAE Grade Summary', href: 'sections/labs/ctcae-grade-summary.html' },
      // Specialized Analysis
      { id: 'dili', label: 'DILI (Hy\'s Law)', href: 'sections/labs/dili.html' }
    ]
  },
  {
    id: 'ecg',
    label: 'ECG',
    items: [
      { id: 'ecg-overview', label: 'QTcF Overview Plot', href: 'sections/ECG/index.html' },
      { id: 'ecg-listing', label: 'QTcF Patient Listing', href: 'sections/ECG/listing.html' },
      { id: 'ecg-individual', label: 'QTcF Individual Profiles', href: 'sections/ECG/individual.html' }
    ]
  },
  {
    id: 'mutation',
    label: 'Mutation',
    items: [
      { id: 'mutation-analysis', label: 'G360 Mutation Analysis', href: 'sections/mutation/index.html' },
      { id: 'mutation-cohort', label: 'Full Cycle by Cohort', href: 'sections/mutation/cohort-mutation.html' },
      { id: 'waterfall', label: 'Waterfall — Best mAF Change', href: 'sections/mutation/waterfall.html' },
      { id: 'best-response', label: 'C797S Best Response', href: 'sections/mutation/best-response.html' }
    ]
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { id: 'enrollment-dash', label: 'Enrollment Dashboard', href: 'sections/operations/index.html' },
      { id: 'visit-compliance', label: 'Visit Compliance', href: 'sections/operations/index.html#visits' },
      { id: 'data-status', label: 'Data Status & Queries', href: 'sections/operations/index.html#data' },
      { id: 'protocol-dev', label: 'Protocol Deviations', href: 'sections/operations/index.html#deviations' },
      { id: 'queries-plots', label: 'Queries by Plots', href: 'sections/operations/queries-plots.html' },
      { id: 'queries-list', label: 'Queries by List', href: 'sections/operations/queries-list.html' }
    ]
  },
  {
    id: 'admin',
    label: 'Admin',
    items: [
      { id: 'users', label: 'User & Roles', href: 'sections/admin/index.html' }
    ]
  }
];

function renderNav(activeSection, activeItem, basePath) {
  const container = document.getElementById('global-nav');
  if (!container) return;

  // Ensure basePath is a string, default to empty string if undefined or null
  if (basePath === undefined || basePath === null) {
    basePath = '';
  }
  basePath = String(basePath);

  const homeHref = basePath ? basePath + 'index.html' : 'index.html';

  // Calculate icon path - Image-save is at project root level (sibling to clinical-dashboard)
  // basePath examples: '' (root), '../../' (deep pages), '../../../' (very deep), etc.
  // Image-save is at ../Image-save/ relative to clinical-dashboard root
  // basePath gets us to clinical-dashboard root, so we need one more '../' to reach project root
  let iconPath;
  if (basePath && basePath !== '') {
    // basePath already gets us to clinical-dashboard root, add '../' to go to project root
    iconPath = basePath + '../Image-save/BHT.png';
  } else {
    // At clinical-dashboard root, go up one level to project root
    iconPath = '../Image-save/BHT.png';
  }
  
  let html = `
    <nav class="nav-container">
      <a href="${homeHref}" class="nav-brand">
        <div class="nav-brand-icon">
          <img src="${iconPath}" alt="Clinical Trial Logo" />
        </div>
        <div class="nav-brand-text">
          <span class="nav-brand-title">Clinical Trial</span>
          <span class="nav-brand-subtitle">Dashboard</span>
        </div>
      </a>
      <div class="nav-menu">
  `;

  for (const section of NAV_STRUCTURE) {
    const isActive = section.id === activeSection;
    
    html += `
        <div class="nav-item">
          <div class="nav-link ${isActive ? 'active' : ''}">
            ${section.label}
            <span class="arrow">▼</span>
          </div>
          <div class="nav-dropdown">
    `;

    for (const item of section.items) {
      if (item.type === 'divider') {
        html += '<div class="dropdown-divider"></div>';
      } else if (item.type === 'header') {
        html += `<div class="dropdown-header">${item.label}</div>`;
      } else {
        const itemActive = item.id === activeItem;
        const href = basePath + item.href;
        html += `
            <a href="${href}" class="dropdown-item ${itemActive ? 'active' : ''}">
              ${item.label}
            </a>
        `;
      }
    }

    html += `
          </div>
        </div>
    `;
  }

  html += `
      </div>
      <div class="nav-right-tag">BH-30643</div>
    </nav>
  `;

  container.innerHTML = html;
}

