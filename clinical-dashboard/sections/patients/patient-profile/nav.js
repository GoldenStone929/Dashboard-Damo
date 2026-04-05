/**
 * Clinical Dashboard - Global Navigation
 * Renders floating nav bar with dropdowns
 */

// Navigation structure with all sections and items
const NAV_STRUCTURE = [
  {
    id: 'study-overview',
    label: 'Study Overview',
    items: [
      { id: 'summary', label: 'Study Summary', href: 'sections/study-overview/summary.html', desc: 'Overall N, phase, treatment duration' },
      { id: 'enrollment', label: 'Enrollment & Disposition', href: 'sections/study-overview/enrollment.html', desc: 'Screened, enrolled, ongoing, completed' },
      { id: 'dose-cohorts', label: 'Dose Cohorts Overview', href: 'sections/study-overview/dose-cohorts.html', desc: 'Per-dose N, DLT, ≥Grade 3 TEAE' },
      { id: 'icf-screening', label: 'ICF & Screening', href: 'sections/study-overview/icf-screening.html', desc: 'ICF signed, screened, screen failed' },
      { id: 'eot-eos', label: 'EOT / EOS Details', href: 'sections/study-overview/eot-eos.html', desc: 'End of treatment/study reasons' }
    ]
  },
  {
    id: 'patients',
    label: 'Patients',
    items: [
      { id: 'patient-list', label: 'Patient List', href: 'sections/patients/patient-list.html', desc: 'Filter by Subject / Site / Dose' },
      { type: 'divider' },
      { type: 'header', label: 'Patient Profile' },
      { id: 'profile-summary', label: 'Summary', href: 'sections/patients/patient-profile/summary.html', desc: 'Demographics, baseline, milestones' },
      { id: 'profile-dosing', label: 'Dosing & Visits', href: 'sections/patients/patient-profile/dosing.html', desc: 'Dosing timeline, missed visits' },
      { id: 'profile-ae', label: 'Adverse Events', href: 'sections/patients/patient-profile/ae-timeline.html', desc: 'AE timeline, TEAE, listing' },
      { id: 'profile-cm', label: 'Concomitant Medications', href: 'sections/patients/patient-profile/cm-timeline.html', desc: 'CM timeline, listing, prior Tx' },
      { id: 'profile-vitals', label: 'Vital Signs & ECG', href: 'sections/patients/patient-profile/vitals.html', desc: 'BP, HR, Respiration, QTcF' },
      { id: 'profile-labs', label: 'Labs', href: 'sections/patients/patient-profile/labs.html', desc: 'Lab panels, analyte trends' },
      { id: 'profile-pkpd', label: 'PK / PD', href: 'sections/patients/patient-profile/pkpd.html', desc: 'Patient-level PK time-course' },
      { id: 'profile-dose-ae-lab', label: 'Dose & AE & Lab - normalized', href: 'sections/patients/patient-profile/dose-ae-lab.html', desc: 'Dose, AE, and Lab values - normalized view' },
      { id: 'profile-dose-ae-lab-absolute', label: 'Dose & AE & Lab - absolute', href: 'sections/patients/patient-profile/dose-ae-lab-absolute.html', desc: 'Dose, AE, and Lab values - absolute view' }
    ]
  },
  {
    id: 'safety',
    label: 'Safety',
    items: [
      { id: 'teae-overview', label: 'TEAE Overview', href: 'sections/safety/index.html', desc: 'AE counts by SOC / PT' },
      { id: 'sae-aesi', label: 'SAE & AESI', href: 'sections/safety/index.html#sae', desc: 'Serious AEs, events of special interest' },
      { id: 'lab-safety', label: 'Lab Safety', href: 'sections/safety/index.html#lab', desc: "Lab shift, Hy's Law, liver/renal" },
      { id: 'vitals-summary', label: 'Vital Signs Summary', href: 'sections/safety/index.html#vitals', desc: 'BP, HR, respiration summary' },
      { id: 'ecg-summary', label: 'ECG / QTcF Summary', href: 'sections/safety/index.html#ecg', desc: 'QTcF distribution, thresholds' },
      { id: 'bilirubin', label: 'Bilirubin Section', href: 'sections/safety/bilirubin.html', desc: 'Bilirubin-focused safety, DILI' }
    ]
  },
  {
    id: 'efficacy',
    label: 'Efficacy',
    items: [
      { id: 'response', label: 'Response Summary', href: 'sections/efficacy/index.html', desc: 'ORR / DCR by cohort' },
      { id: 'waterfall', label: 'Waterfall Plot', href: 'sections/efficacy/index.html#waterfall', desc: 'Best tumor burden change' },
      { id: 'spider', label: 'Spider Plot', href: 'sections/efficacy/index.html#spider', desc: 'Tumor burden over time' },
      { id: 'swimmer', label: 'Swimmer Plot', href: 'sections/efficacy/index.html#swimmer', desc: 'Treatment & response duration' },
      { id: 'line-plot', label: 'Line Plot', href: 'sections/efficacy/line-plot.html', desc: 'Time-based efficacy curves' }
    ]
  },
  {
    id: 'pkpd',
    label: 'PK / PD',
    items: [
      { id: 'pk-summary', label: 'PK Summary', href: 'sections/pkpd/index.html', desc: 'Cmax / AUC / t½ by dose' },
      { id: 'pk-compliance', label: 'PK Sampling Compliance', href: 'sections/pkpd/index.html#compliance', desc: 'Planned vs collected samples' },
      { id: 'exp-safety', label: 'Exposure vs Safety', href: 'sections/pkpd/index.html#safety', desc: 'Cmax/AUC vs AE, labs' },
      { id: 'exp-efficacy', label: 'Exposure vs Efficacy', href: 'sections/pkpd/index.html#efficacy', desc: 'Exposure vs response, ORR' }
    ]
  },
  {
    id: 'labs',
    label: 'Labs',
    items: [
      { id: 'lab-uln-lln', label: 'Lab Normalized (ULN/LLN)', href: 'sections/labs/normalized.html', desc: 'One-sided normalization (Value/ULN or LLN/Value)' },
      { id: 'lab-normalized', label: 'Lab Normalized - By Patient', href: 'sections/labs/lab-normalized.html', desc: 'Per-patient normalized lab values' }
    ]
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { id: 'enrollment-dash', label: 'Enrollment Dashboard', href: 'sections/operations/index.html', desc: 'Enrollment over time, by site' },
      { id: 'visit-compliance', label: 'Visit Compliance', href: 'sections/operations/index.html#visits', desc: 'Completion rates, delays' },
      { id: 'data-status', label: 'Data Status & Queries', href: 'sections/operations/index.html#data', desc: 'Data entry, open queries' },
      { id: 'protocol-dev', label: 'Protocol Deviations', href: 'sections/operations/index.html#deviations', desc: 'Deviations by type/site' },
      { id: 'queries-plots', label: 'Queries by Plots', href: 'sections/operations/queries-plots.html', desc: 'Visual query view' },
      { id: 'queries-list', label: 'Queries by List', href: 'sections/operations/queries-list.html', desc: 'Tabular query view' }
    ]
  },
  {
    id: 'admin',
    label: 'Admin',
    items: [
      { id: 'users', label: 'User & Roles', href: 'sections/admin/index.html', desc: 'Manage users, assign roles' }
    ]
  }
];

/**
 * Calculate correct relative path from current page to target
 * @param {string} targetPath - Path from project root (e.g., 'sections/safety/index.html')
 * @param {string} basePath - Base path prefix for current page depth
 * @returns {string} Correct relative path
 */
function getRelativePath(targetPath, basePath) {
  if (!basePath) return targetPath;
  return basePath + targetPath;
}

/**
 * Render the global navigation bar
 * @param {string} activeSection - ID of currently active section (e.g., 'patients')
 * @param {string} activeItem - ID of currently active item (e.g., 'patient-list')
 * @param {string} basePath - Relative path prefix to project root (e.g., '../../' for deep pages)
 */
function renderNav(activeSection = '', activeItem = '', basePath = '') {
  const container = document.getElementById('global-nav');
  if (!container) {
    console.error('Nav container #global-nav not found');
    return;
  }

  const homeHref = basePath ? basePath + 'index.html' : 'index.html';

  let html = `
    <nav class="nav-container">
      <a href="${homeHref}" class="nav-brand">
        <div class="nav-brand-icon">CT</div>
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
        const href = getRelativePath(item.href, basePath);
        html += `
            <a href="${href}" class="dropdown-item ${itemActive ? 'active' : ''}">
              ${item.label}
              ${item.desc ? `<span class="item-desc">${item.desc}</span>` : ''}
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
    </nav>
  `;

  container.innerHTML = html;
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Check if nav was already rendered by page script
    const container = document.getElementById('global-nav');
    if (container && !container.innerHTML.trim()) {
      renderNav();
    }
  });
}
