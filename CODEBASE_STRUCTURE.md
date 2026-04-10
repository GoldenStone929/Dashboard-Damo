# Clinical Dashboard Codebase Structure

This document is a practical guide to the current `Dashboard-Damo` repository.

It is written for a reader with basic coding knowledge who wants to understand:

- what this repository is for
- how the dashboard runs
- how data moves through the system
- what each major file or folder does
- which parts are active runtime code versus support or legacy material

## 1. What This Repository Is

This repository contains a **static clinical dashboard**.

There is no backend web app, no API server, and no build step such as React/Vite/Webpack.
Instead, the dashboard is made of:

- static HTML pages
- shared CSS and JavaScript helpers
- CSV and XLSX data files loaded directly in the browser
- Python and Node helper scripts for data generation and maintenance

In short:

1. a user opens an HTML page
2. that page loads one or more data files from `clinical-dashboard/data/`
3. the page transforms the raw rows in inline JavaScript
4. the page renders tables, cards, and charts in the browser

The repository is designed to be easy to open locally, even without a full developer toolchain.

## 2. High-Level Runtime Flow

The dashboard works like this:

1. The user opens [`clinical-dashboard/index.html`](clinical-dashboard/index.html).
2. The page shows a visual landing page and links into the major dashboard sections.
3. Each subpage calls `renderNav(...)` from [`clinical-dashboard/assets/js/nav.js`](clinical-dashboard/assets/js/nav.js) to build the top navigation bar.
4. Each subpage loads the datasets it needs from `clinical-dashboard/data/` using `Papa.parse(...)` or `fetch(...)`.
5. The page’s inline script:
   - detects useful columns
   - parses dates and numbers
   - filters rows
   - groups rows by subject, visit, analyte, arm, or event
   - computes summary statistics or chart series
6. The page renders:
   - HTML tables
   - summary cards
   - Chart.js graphs
   - exportable blocks or full-page reports

This means the **main business logic lives inside individual HTML files**, not in a central application framework.

## 3. End-to-End Workflow

### 3.1 User workflow

- Start from the landing page.
- Use the main navigation to move into a dashboard section.
- Open a page such as study overview, safety, labs, ECG, mutation, or patient profile.
- That page loads the corresponding dataset files and renders an analysis view.

### 3.2 Developer workflow

- If secure real data is unavailable, generate synthetic demo data with [`clinical-dashboard/generate_demo_data.py`](clinical-dashboard/generate_demo_data.py).
- Validate the synthetic data against page expectations with [`clinical-dashboard/validate_demo_data.py`](clinical-dashboard/validate_demo_data.py).
- Open the dashboard locally using a browser or a lightweight local server.
- Edit individual HTML pages or shared helper files as needed.

### 3.3 Data workflow

- Runtime pages read from `clinical-dashboard/data/`.
- The synthetic generator writes compatible CSV/XLSX files into that folder.
- The validator scans the codebase for `data/...` references and checks that expected files and columns exist.

## 4. Repository Tree

```text
Dashboard-Damo/
├── README.md
├── CODEBASE_STRUCTURE.md
├── OPEN_DASHBOARD.vbs
├── Image-save/
│   └── BHT.png
└── clinical-dashboard/
    ├── index.html
    ├── user-agreement.html
    ├── generate_demo_data.py
    ├── validate_demo_data.py
    ├── convert_sas_to_csv.py
    ├── convert_sas_to_csv.js
    ├── get_data_refresh_date.py
    ├── get-data-refresh-date.js
    ├── assets/
    │   ├── css/
    │   │   └── base.css
    │   └── js/
    │       ├── nav.js
    │       ├── block-export.js
    │       ├── chart-export.js
    │       ├── pdf-export.js
    │       ├── word-export.js
    │       ├── hardcode.js
    │       ├── labs-config.js
    │       └── mutation-lock.js
    ├── data/
    └── sections/
        ├── study-overview/
        ├── patients/
        ├── safety/
        ├── labs/
        ├── ECG/
        ├── mutation/
        ├── operations/
        ├── admin/
        ├── pkpd/
        └── efficacy/   (currently an empty reserved directory)
```

## 5. Top-Level Files

### [`README.md`](README.md)

Primary handoff file for the repo.

It explains:

- what the dashboard is
- the main sections
- how to generate demo data
- how to validate the data
- how to run the dashboard locally

### [`CODEBASE_STRUCTURE.md`](CODEBASE_STRUCTURE.md)

This file.

It is meant to help a new collaborator understand the shape and workflow of the repo.

### [`OPEN_DASHBOARD.vbs`](OPEN_DASHBOARD.vbs)

Windows launcher script.

Input:

- local file paths on the user’s machine

Output:

- opens the dashboard in Edge or Chrome with file-access flags

Role in workflow:

- convenience launcher for users opening the dashboard directly from a synced folder

### [`Image-save/BHT.png`](Image-save/BHT.png)

Brand/logo image used by the global navigation bar.

## 6. Main Application Folder: `clinical-dashboard/`

### [`clinical-dashboard/index.html`](clinical-dashboard/index.html)

This is the **main landing page**.

Function:

- presents the dashboard as a tree-style navigation screen
- visually introduces the study and its sections
- links users into the actual analysis pages

Inputs:

- shared styling
- section definitions and links
- refresh-date data if available

Outputs:

- clickable entry point into the whole dashboard

Role in workflow:

- starting point for nearly all users

### [`clinical-dashboard/user-agreement.html`](clinical-dashboard/user-agreement.html)

Standalone legal/disclaimer page.

Function:

- shows a usage agreement and acknowledgement UI

Role in workflow:

- support page rather than core analytic runtime

## 7. Shared Styling and Shared JavaScript

## 7.1 Shared CSS

### [`clinical-dashboard/assets/css/base.css`](clinical-dashboard/assets/css/base.css)

This is the **global style system** for the dashboard.

Function:

- defines the navigation appearance
- sets shared colors, spacing, typography, and dropdown behavior
- provides a common baseline for many section pages

Inputs:

- none beyond normal HTML structure and class names

Outputs:

- consistent look and feel across the dashboard

Role in workflow:

- almost every main page uses it

## 7.2 Shared JS Helpers

### [`clinical-dashboard/assets/js/nav.js`](clinical-dashboard/assets/js/nav.js)

This is the most important shared runtime helper.

Function:

- defines the top-level dashboard navigation in `NAV_STRUCTURE`
- renders the navigation bar into `#global-nav`
- marks the current section and current page as active

Inputs:

- `activeSection`
- `activeItem`
- `basePath`

Outputs:

- injected navigation HTML with working links

Role in workflow:

- nearly every active page calls `renderNav(...)`

### [`clinical-dashboard/assets/js/block-export.js`](clinical-dashboard/assets/js/block-export.js)

Function:

- exports an arbitrary DOM block as an image
- creates and manages an export dialog

Inputs:

- block element ID
- export name
- `html2canvas`

Outputs:

- downloaded PNG image with disclaimer text

Role in workflow:

- used by pages that export a card, chart block, or table region

### [`clinical-dashboard/assets/js/chart-export.js`](clinical-dashboard/assets/js/chart-export.js)

Function:

- exports a chart canvas as an image
- resizes charts for cleaner output

Inputs:

- chart ID
- chart name
- page state object containing chart instances

Outputs:

- downloaded chart image

Role in workflow:

- used on chart-heavy pages that want single-chart export

### [`clinical-dashboard/assets/js/pdf-export.js`](clinical-dashboard/assets/js/pdf-export.js)

Function:

- exports multiple chart blocks into a PDF document

Inputs:

- container ID
- filename
- chart selector
- `html2canvas`
- `jsPDF`

Outputs:

- multi-page PDF report

Role in workflow:

- batch export for report-style pages

### [`clinical-dashboard/assets/js/word-export.js`](clinical-dashboard/assets/js/word-export.js)

Function:

- exports multiple chart blocks into a `.docx` file

Inputs:

- container ID
- filename
- chart selector
- `html2canvas`
- `docx`

Outputs:

- Word document with one chart per page

Role in workflow:

- report export for users who need editable documentation

### [`clinical-dashboard/assets/js/hardcode.js`](clinical-dashboard/assets/js/hardcode.js)

Function:

- stores hardcoded lab cases for specific patients
- provides fallback or curated examples for liver-safety pages

Inputs:

- none at runtime except page references to `LABS_HARDCODED_DATA`

Outputs:

- hardcoded patient lab records and reference ranges

Role in workflow:

- supplements generated data for pages that need specific clinically interesting trajectories

### [`clinical-dashboard/assets/js/labs-config.js`](clinical-dashboard/assets/js/labs-config.js)

Function:

- wraps and exposes lab-specific configuration
- points to shared hardcoded lab data
- keeps backward compatibility with older lab pages

Inputs:

- optional presence of `LABS_HARDCODED_DATA`

Outputs:

- lab configuration object used by normalized and CTCAE lab pages

Role in workflow:

- shared configuration layer for the lab section

### [`clinical-dashboard/assets/js/mutation-lock.js`](clinical-dashboard/assets/js/mutation-lock.js)

Function:

- adds a browser-session password lock to mutation pages

Inputs:

- password entry from the user
- browser `sessionStorage`

Outputs:

- either unlocks mutation pages or blocks access with an overlay

Role in workflow:

- access control at the front-end level for mutation views

## 8. Data and Maintenance Scripts

### [`clinical-dashboard/generate_demo_data.py`](clinical-dashboard/generate_demo_data.py)

This is the most important non-HTML file in the repo.

Function:

- rebuilds the entire `clinical-dashboard/data/` folder with synthetic data

What it generates:

- subject-level demographics and disposition
- visits and vitals
- adverse events
- concomitant medications and prior cancer therapy
- lab data and lab helper tables
- ECG data
- mutation data
- compatibility alias files
- refresh metadata

Inputs:

- internal constants in the script
- random seed
- visit schedule definitions
- analyte definitions

Outputs:

- a complete demo `data/` directory

Role in workflow:

- replaces the removed secure data package
- makes the static dashboard usable locally

### [`clinical-dashboard/validate_demo_data.py`](clinical-dashboard/validate_demo_data.py)

Function:

- statically checks that the current codebase can find the data files it references
- checks required columns for important datasets

Inputs:

- code files in the repo
- generated files in `clinical-dashboard/data/`

Outputs:

- pass/fail validation report

Role in workflow:

- safety net after data generation or schema changes

### [`clinical-dashboard/convert_sas_to_csv.py`](clinical-dashboard/convert_sas_to_csv.py)

Function:

- converts `data/dm.sas7bdat` to `data/dm.CSV`

Inputs:

- SAS dataset file

Outputs:

- CSV version of the subject-level demographic dataset

Role in workflow:

- maintenance utility for SAS-origin data

### [`clinical-dashboard/convert_sas_to_csv.js`](clinical-dashboard/convert_sas_to_csv.js)

Node version of the same conversion job.

### [`clinical-dashboard/get_data_refresh_date.py`](clinical-dashboard/get_data_refresh_date.py)

Function:

- scans the `data/` folder
- writes `refresh-date.json` based on the most recently modified CSV

Outputs:

- metadata file used by the dashboard to show “last refresh”

### [`clinical-dashboard/get-data-refresh-date.js`](clinical-dashboard/get-data-refresh-date.js)

Node version of the same refresh-date job.

## 9. The Data Folder

Path:

- [`clinical-dashboard/data/`](clinical-dashboard/data)

This folder is the runtime data source for nearly everything.

### 9.1 Main dataset groups

- Subject and demographics:
  - `dm.CSV`
  - `subj.CSV`
  - `dmmr.csv`
- Study disposition:
  - `dsic.CSV`
  - `dsen.CSV`
  - `dset.CSV`
  - `dses.CSV`
- Medical history:
  - `mh.CSV`
  - `mhcan.csv`
  - `mhca.csv`
- Visits and vitals:
  - `vis.CSV`
  - `vs.CSV`
- Adverse events and dose changes:
  - `ae.CSV`
  - `dd.CSV`
  - `dose_change.CSV`
- Medications and prior treatment:
  - `cm.csv`
  - `cmpc.CSV`
- Laboratory data:
  - `lab.CSV`
  - `lblc.CSV`
  - `lblh.CSV`
- ECG:
  - `Export_ECG_new.csv`
  - `Export_ECG_new.xlsx`
  - compatibility aliases such as `Export_ECG.csv` and `ecg.csv`
- Mutation:
  - `G360_Filtered.csv`
- Metadata:
  - `refresh-date.json`

### 9.2 General data shape

Most pages expect:

- one row per event, visit, lab draw, or subject record
- stable identifiers like `SUBJID`, `USUBJID`, or `Subject`
- visit/folder fields such as `Folder`, `VISIT`, or `Visit`
- mixed legacy date conventions, especially SAS-like strings

### 9.3 Why there are duplicate or alias files

This repo contains legacy page logic that references:

- upper-case and lower-case filenames
- slightly different date formats
- multiple alternative column names for the same concept

The generator intentionally includes compatibility aliases so the pages continue to work without rewriting every page script.

## 10. Sections: What the Dashboard Shows

Every section is a folder under [`clinical-dashboard/sections/`](clinical-dashboard/sections).

## 10.1 Study Overview

Path:

- [`clinical-dashboard/sections/study-overview/`](clinical-dashboard/sections/study-overview)

Purpose:

- trial-level summaries rather than one-subject detail

Files:

- [`summary.html`](clinical-dashboard/sections/study-overview/summary.html)
  - study summary cards and high-level dashboard view
  - inputs: subject, AE, dose-change, refresh-date data
  - outputs: top-level study metrics and overview visuals
- [`demographics.html`](clinical-dashboard/sections/study-overview/demographics.html)
  - demographics distributions, ECOG, baseline characteristics
  - inputs: `dm`, `dmmr`, `rsecog1`, `vs`
  - outputs: charts/tables for age, sex, race, ECOG, baseline body measures
- [`enrollment.html`](clinical-dashboard/sections/study-overview/enrollment.html)
  - enrollment and disposition progress
  - inputs: `dm`, `dsen`
  - outputs: screened/enrolled/disposition summaries
- [`dose-cohorts.html`](clinical-dashboard/sections/study-overview/dose-cohorts.html)
  - dose-level overview
  - inputs: `dm`, `ae`
  - outputs: cohort counts and selected safety summaries
- [`icf-screening.html`](clinical-dashboard/sections/study-overview/icf-screening.html)
  - informed consent and screening flow
  - inputs: `dsic`
  - outputs: ICF timing and screening statistics
- [`medical-history.html`](clinical-dashboard/sections/study-overview/medical-history.html)
  - population-level medical history review
  - inputs: `mh`, `dm`
  - outputs: condition frequencies and grouped summaries
- [`eot-eos.html`](clinical-dashboard/sections/study-overview/eot-eos.html)
  - end-of-treatment and end-of-study reasons
  - inputs: `dset`, `dses`, `dm`
  - outputs: disposition breakdowns

Position in workflow:

- this section is where someone first asks, “How is the trial going overall?”

## 10.2 Patients

Path:

- [`clinical-dashboard/sections/patients/`](clinical-dashboard/sections/patients)

Purpose:

- subject-level exploration

### Main patient list

- [`patient-list.html`](clinical-dashboard/sections/patients/patient-list.html)
  - the main roster page
  - inputs: `dm.CSV`, `subj.CSV`
  - outputs: grouped/filterable patient list with links to subject pages

### Patient profile subfolder

Path:

- [`clinical-dashboard/sections/patients/patient-profile/`](clinical-dashboard/sections/patients/patient-profile)

This is the largest single sub-area in the repo.

Active runtime pages:

- [`summary.html`](clinical-dashboard/sections/patients/patient-profile/summary.html)
  - one-patient baseline summary
  - inputs: multiple subject, disposition, ECOG, and disease-characteristic files
  - outputs: profile table/cards for one patient
- [`medical-history.html`](clinical-dashboard/sections/patients/patient-profile/medical-history.html)
  - patient-level medical history review
  - inputs: `mh`, supporting subject context
  - outputs: tables/charts of prior conditions
- [`cm-prior-tx.html`](clinical-dashboard/sections/patients/patient-profile/cm-prior-tx.html)
  - prior cancer treatment history
  - inputs: `cmpc.CSV`
  - outputs: timeline/listing of earlier therapies
- [`cm-timeline.html`](clinical-dashboard/sections/patients/patient-profile/cm-timeline.html)
  - concomitant medication timeline
  - inputs: `cm.csv`
  - outputs: medication bars across relative dates
- [`visits.html`](clinical-dashboard/sections/patients/patient-profile/visits.html)
  - visit schedule/status page
  - intended role: subject-level visit history
  - current codebase status: route exists, but this area is more fragile/legacy than the main analytic pages
- [`visit-compliance.html`](clinical-dashboard/sections/patients/patient-profile/visit-compliance.html)
  - visit completion/missed/unknown review
  - inputs: `vis.CSV`
  - outputs: visit-level status tables and compliance summaries
- [`dosing-history.html`](clinical-dashboard/sections/patients/patient-profile/dosing-history.html)
  - dose exposure history for one patient
  - inputs: dose-change and exposure-related datasets such as `ecclin`, `ecad`, `ecsd`, `ecmd`
  - outputs: longitudinal dosing record
- [`dose-ae-lab.html`](clinical-dashboard/sections/patients/patient-profile/dose-ae-lab.html)
  - normalized combined timeline
  - inputs: dosing, AE, CM, and lab data
  - outputs: a combined subject-level clinical timeline
- [`dose-ae-lab-absolute.html`](clinical-dashboard/sections/patients/patient-profile/dose-ae-lab-absolute.html)
  - similar to the previous page, but focused on absolute values
- [`ae-teae.html`](clinical-dashboard/sections/patients/patient-profile/ae-teae.html)
  - patient-level adverse-event review
  - inputs: `ae`, `vis`, `dset`
  - outputs: event timeline and listing
- [`vitals.html`](clinical-dashboard/sections/patients/patient-profile/vitals.html)
  - vital-sign trend view
  - inputs: `vs.CSV`
  - outputs: charts of BP, HR, respiration, etc.
- [`ecg-qtcf.html`](clinical-dashboard/sections/patients/patient-profile/ecg-qtcf.html)
  - patient QTcF and ECG interval page
  - inputs: ECG export file
  - outputs: per-subject ECG/QTcF review
- [`labs.html`](clinical-dashboard/sections/patients/patient-profile/labs.html)
  - patient-level laboratory review
  - inputs: `lab.CSV`
  - outputs: patient-specific analyte tables/plots

Support or navigation files:

- [`nav.js`](clinical-dashboard/sections/patients/patient-profile/nav.js)
  - older/local nav variant for patient-profile pages
  - overlaps conceptually with the global `assets/js/nav.js`
- [`base.css`](clinical-dashboard/sections/patients/patient-profile/base.css)
  - local styling system for patient-profile pages
  - mainly useful for older or self-contained page variants

Legacy or reference files:

- [`backup.html`](clinical-dashboard/sections/patients/patient-profile/backup.html)
  - older snapshot of a combined dose/AE/lab page
  - not a clean main entry point
- [`all-pages-part1.txt`](clinical-dashboard/sections/patients/patient-profile/all-pages-part1.txt)
  - text snapshot/reference of older page content
- [`all-pages-part2.txt`](clinical-dashboard/sections/patients/patient-profile/all-pages-part2.txt)
  - continuation of the same reference material
- [`index.html`](clinical-dashboard/sections/patients/patient-profile/index.html)
  - legacy/homepage-like patient-profile page
- [`patient-list.html`](clinical-dashboard/sections/patients/patient-profile/patient-list.html)
  - duplicate/older patient list page kept in the subfolder
- [`dosing.html`](clinical-dashboard/sections/patients/patient-profile/dosing.html)
  - route-level placeholder/hub rather than a full analytic page
- [`pkpd.html`](clinical-dashboard/sections/patients/patient-profile/pkpd.html)
  - route-level placeholder for patient-level PK/PD

Position in workflow:

- this section answers, “What happened to this particular patient?”

## 10.3 Safety

Path:

- [`clinical-dashboard/sections/safety/`](clinical-dashboard/sections/safety)

Purpose:

- study-level safety analysis, especially TEAE and hepatic safety

Files:

- [`dashboard.html`](clinical-dashboard/sections/safety/dashboard.html)
  - broad AE dashboard
- [`ae_summary_table.html`](clinical-dashboard/sections/safety/ae_summary_table.html)
  - summarized AE tables
- [`ae-detail.html`](clinical-dashboard/sections/safety/ae-detail.html)
  - detailed AE listing
- [`index.html`](clinical-dashboard/sections/safety/index.html)
  - TEAE event-level overview
- [`teae-subject.html`](clinical-dashboard/sections/safety/teae-subject.html)
  - subject-level TEAE overview
- [`teae-related-nonrelated.html`](clinical-dashboard/sections/safety/teae-related-nonrelated.html)
  - event-level split by relatedness
- [`teae-subject-related-nonrelated.html`](clinical-dashboard/sections/safety/teae-subject-related-nonrelated.html)
  - subject-level split by relatedness
- [`teae-analysis.html`](clinical-dashboard/sections/safety/teae-analysis.html)
  - TEAE dashboard-style analytic page
- [`teae-table.html`](clinical-dashboard/sections/safety/teae-table.html)
  - TEAE listing table
- [`bilirubin.html`](clinical-dashboard/sections/safety/bilirubin.html)
  - bilirubin-focused CTCAE page
- [`max-bilirubin-treatment.html`](clinical-dashboard/sections/safety/max-bilirubin-treatment.html)
  - treatment-arm comparison for bilirubin maxima

Typical inputs:

- `ae.CSV`
- `dm.CSV`
- lab files
- dose-change files where needed

Typical outputs:

- TEAE tables
- subject/event counts
- grade summaries
- liver-safety charts

Position in workflow:

- this section answers, “What safety signals or toxicity patterns are visible across the study?”

## 10.4 Labs

Path:

- [`clinical-dashboard/sections/labs/`](clinical-dashboard/sections/labs)

Purpose:

- study-level laboratory visualization and CTCAE grading

Files:

- [`lab-original.html`](clinical-dashboard/sections/labs/lab-original.html)
  - raw laboratory values
- [`normalized.html`](clinical-dashboard/sections/labs/normalized.html)
  - one-sided normalization logic such as `value/ULN` or `LLN/value`
- [`lab-normalized.html`](clinical-dashboard/sections/labs/lab-normalized.html)
  - normalized lab review oriented around patient-level traces
- [`ctcae-labs.html`](clinical-dashboard/sections/labs/ctcae-labs.html)
  - CTCAE lab review by patient
- [`CTCAE.html`](clinical-dashboard/sections/labs/CTCAE.html)
  - CTCAE lab review across all patients
- [`ctcae-grade-summary.html`](clinical-dashboard/sections/labs/ctcae-grade-summary.html)
  - worsening-from-baseline summary
- [`dili.html`](clinical-dashboard/sections/labs/dili.html)
  - DILI / Hy’s law review
- [`run_ctcae_unit_tests.py`](clinical-dashboard/sections/labs/run_ctcae_unit_tests.py)
  - QuickJS-based test runner for the CTCAE logic embedded in `ctcae-grade-summary.html`
- [`ctcae-unit-test-results.txt`](clinical-dashboard/sections/labs/ctcae-unit-test-results.txt)
  - last saved test result report

Typical inputs:

- `lab.CSV`
- `lblc.CSV`
- `lblh.CSV`
- `dm.CSV`
- hardcoded lab cases from shared JS

Typical outputs:

- lab trend charts
- CTCAE-grade summaries
- analyte-specific abnormality analyses

Position in workflow:

- this section answers, “How do key lab markers behave over time and by severity?”

## 10.5 ECG

Path:

- [`clinical-dashboard/sections/ECG/`](clinical-dashboard/sections/ECG)

Purpose:

- reusable ECG/QTcF analysis based on a shared JS module

Files:

- [`ecg-data.js`](clinical-dashboard/sections/ECG/ecg-data.js)
  - shared data loader, column detector, date parser, metric config, and aggregation logic
  - this is one of the few truly modular analysis files in the repo
- [`index.html`](clinical-dashboard/sections/ECG/index.html)
  - ECG overview plot
- [`listing.html`](clinical-dashboard/sections/ECG/listing.html)
  - patient listing
- [`individual.html`](clinical-dashboard/sections/ECG/individual.html)
  - individual profiles

Typical inputs:

- ECG `.xlsx` or `.csv` export files

Typical outputs:

- aggregated QTcF and interval plots
- listings and patient-level drilldowns

Position in workflow:

- complements the patient-level ECG page with a section-wide ECG module

## 10.6 Mutation

Path:

- [`clinical-dashboard/sections/mutation/`](clinical-dashboard/sections/mutation)

Purpose:

- ctDNA / mutation-focused analysis

Files:

- [`index.html`](clinical-dashboard/sections/mutation/index.html)
  - main mutation overview
- [`cohort-mutation.html`](clinical-dashboard/sections/mutation/cohort-mutation.html)
  - full-cycle by cohort
- [`waterfall.html`](clinical-dashboard/sections/mutation/waterfall.html)
  - best percent change in mutation allele fraction
- [`best-response.html`](clinical-dashboard/sections/mutation/best-response.html)
  - C797S baseline-to-best-response page

Typical inputs:

- `G360_Filtered.csv`

Typical outputs:

- waterfall plots
- cohort comparisons
- mutation response summaries

Position in workflow:

- this section answers, “How do mutation-based biomarker signals change over time or across cohorts?”

## 10.7 Operations

Path:

- [`clinical-dashboard/sections/operations/`](clinical-dashboard/sections/operations)

Purpose:

- operational and query-monitoring area

Files:

- [`index.html`](clinical-dashboard/sections/operations/index.html)
- [`queries-list.html`](clinical-dashboard/sections/operations/queries-list.html)
- [`queries-plots.html`](clinical-dashboard/sections/operations/queries-plots.html)

Current codebase status:

- this area is more of a scaffold/placeholder zone than a full operational analytics implementation

Position in workflow:

- intended for operational monitoring rather than clinical science review

## 10.8 Admin

Path:

- [`clinical-dashboard/sections/admin/`](clinical-dashboard/sections/admin)

Files:

- [`index.html`](clinical-dashboard/sections/admin/index.html)
  - user access management UI
  - mainly a static/illustrative admin page
- [`auth-config.html`](clinical-dashboard/sections/admin/auth-config.html)
  - small configuration page that exposes an obfuscated authentication config object

Position in workflow:

- support/admin area, not core data analytics

## 10.9 PK/PD

Path:

- [`clinical-dashboard/sections/pkpd/`](clinical-dashboard/sections/pkpd)

Files:

- [`index.html`](clinical-dashboard/sections/pkpd/index.html)

Current codebase status:

- mostly placeholder/reserved for PK/PD expansion

## 10.10 Efficacy

Path:

- [`clinical-dashboard/sections/efficacy/`](clinical-dashboard/sections/efficacy)

Current codebase status:

- the directory currently exists but does not contain active files
- navigation references still imply this section was intended to hold response, waterfall, spider, swimmer, and line-plot pages

Treat this as a **reserved section**, not a complete active module.

## 11. How the Code Is Organized Internally

The repo uses a repeated pattern:

### Pattern A: Shared utility + thin pages

Used mainly in:

- ECG section

How it works:

- a shared JS module loads data and exposes helpers
- several HTML pages reuse that shared logic

### Pattern B: Self-contained HTML pages

Used in:

- study-overview
- safety
- labs
- many patient-profile pages

How it works:

- each HTML file contains:
  - page layout
  - page-specific CSS
  - page-specific JavaScript
  - data loading
  - transformation logic
  - chart/table rendering

This is the dominant style in the repo.

### Pattern C: Utility scripts outside runtime

Used in:

- demo data generation
- validation
- data refresh metadata generation
- SAS conversion
- export helpers

## 12. External Libraries and Browser Dependencies

These pages typically rely on CDNs rather than installed npm packages.

Common external runtime libraries:

- Papa Parse
  - CSV parsing in the browser
- Chart.js
  - charts and plots
- html2canvas
  - export image capture
- jsPDF
  - PDF export
- docx
  - Word export
- SheetJS / XLSX
  - reading ECG Excel files

This is why there is no `package.json`: the pages pull dependencies directly in the HTML.

## 13. Active Code vs Legacy or Reference Material

A new reader should distinguish these categories:

### Active runtime code

- `clinical-dashboard/index.html`
- most files under `sections/study-overview`
- most files under `sections/safety`
- most files under `sections/labs`
- most files under `sections/ECG`
- most files under `sections/mutation`
- the main `sections/patients/patient-list.html`
- the main patient-profile analysis pages

### Support code

- `assets/js/*`
- `generate_demo_data.py`
- `validate_demo_data.py`
- `convert_*`
- `get_data_refresh_date*`

### Legacy, backup, placeholder, or reserved material

- `sections/patients/patient-profile/backup.html`
- `sections/patients/patient-profile/all-pages-part1.txt`
- `sections/patients/patient-profile/all-pages-part2.txt`
- `sections/patients/patient-profile/index.html`
- `sections/patients/patient-profile/patient-list.html`
- `sections/patients/patient-profile/dosing.html`
- `sections/patients/patient-profile/pkpd.html`
- `sections/operations/*` in their current scaffolded form
- `sections/pkpd/index.html`
- empty `sections/efficacy/`

These files are still useful for context, compatibility, or future work, but they are not the clearest examples of the core runtime architecture.

## 14. How to Read the Codebase Efficiently

If someone is new to this repo, the best reading order is:

1. [`README.md`](README.md)
2. [`clinical-dashboard/index.html`](clinical-dashboard/index.html)
3. [`clinical-dashboard/assets/js/nav.js`](clinical-dashboard/assets/js/nav.js)
4. [`clinical-dashboard/generate_demo_data.py`](clinical-dashboard/generate_demo_data.py)
5. one simple page from each major section:
   - [`study-overview/summary.html`](clinical-dashboard/sections/study-overview/summary.html)
   - [`patients/patient-list.html`](clinical-dashboard/sections/patients/patient-list.html)
   - [`patients/patient-profile/summary.html`](clinical-dashboard/sections/patients/patient-profile/summary.html)
   - [`safety/index.html`](clinical-dashboard/sections/safety/index.html)
   - [`labs/lab-original.html`](clinical-dashboard/sections/labs/lab-original.html)
   - [`ECG/ecg-data.js`](clinical-dashboard/sections/ECG/ecg-data.js)
   - [`mutation/index.html`](clinical-dashboard/sections/mutation/index.html)

That reading order gives the best picture of the whole system without getting lost in page-specific details too early.

## 15. What To Change When You Need To Modify Something

### If a page shows “no data”

Check:

1. the page’s referenced file path in `data/`
2. the expected columns
3. the date format the page parser expects
4. whether the generator already produces a compatibility alias for that page

Best files to inspect:

- page HTML
- [`clinical-dashboard/validate_demo_data.py`](clinical-dashboard/validate_demo_data.py)
- [`clinical-dashboard/generate_demo_data.py`](clinical-dashboard/generate_demo_data.py)

### If navigation is wrong

Check:

- [`clinical-dashboard/assets/js/nav.js`](clinical-dashboard/assets/js/nav.js)
- [`clinical-dashboard/sections/patients/patient-profile/nav.js`](clinical-dashboard/sections/patients/patient-profile/nav.js) if it is a patient-profile-specific navigation issue

### If styling is inconsistent

Check:

- [`clinical-dashboard/assets/css/base.css`](clinical-dashboard/assets/css/base.css)
- page-local `<style>` blocks
- [`clinical-dashboard/sections/patients/patient-profile/base.css`](clinical-dashboard/sections/patients/patient-profile/base.css) for older patient-profile-specific styling

### If demo data needs to change

Edit:

- [`clinical-dashboard/generate_demo_data.py`](clinical-dashboard/generate_demo_data.py)

Then rerun:

```bash
python3 clinical-dashboard/generate_demo_data.py
python3 clinical-dashboard/validate_demo_data.py
```

## 16. Summary

The codebase is best understood as:

- a **static multi-page dashboard**
- powered by **CSV/XLSX files loaded in the browser**
- with **page-specific logic embedded directly in each HTML file**
- supported by a small set of **shared utilities** for navigation, exports, lab config, and ECG processing
- and made locally usable by a **synthetic data generator** and **data validator**

If you remember only one idea, remember this:

> This repo is not a component-based web app. It is a collection of self-contained analysis pages that all read from a shared data folder and are stitched together by a shared navigation bar.
