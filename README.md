# Dashboard-Damo

Static clinical dashboard demo for exploratory review of study overview, safety, labs, mutation, ECG, and patient-profile views.

The original secure `clinical-dashboard/data/` folder is intentionally not included in the repository. This repo now includes a reproducible synthetic data generator so the UI can still be opened locally and exercised end to end.

## Repo Layout

- [`clinical-dashboard/index.html`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/index.html) is the landing page and tree-style navigation hub.
- [`clinical-dashboard/assets/js/nav.js`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/assets/js/nav.js) defines the shared global navigation used across sections.
- [`clinical-dashboard/assets/js/`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/assets/js) contains shared export helpers, lab hardcoded examples, and section-level utilities.
- [`clinical-dashboard/sections/study-overview/`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/sections/study-overview) contains enrollment, demographics, summary, ICF/screening, medical history, and disposition pages.
- [`clinical-dashboard/sections/safety/`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/sections/safety) contains TEAE charts, dashboards, summaries, bilirubin analysis, and AE listings.
- [`clinical-dashboard/sections/labs/`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/sections/labs) contains raw, normalized, CTCAE, and worsening-from-baseline lab views.
- [`clinical-dashboard/sections/patients/`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/sections/patients) contains the patient list plus patient-profile subpages for summary, vitals, ECG, labs, medical history, dosing, medications, and AE review.
- [`clinical-dashboard/sections/mutation/`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/sections/mutation) contains G360 mutation overview, waterfall, best-response, and cohort displays.
- [`clinical-dashboard/sections/ECG/`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/sections/ECG) contains shared ECG/QTcF views driven by [`ecg-data.js`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/sections/ECG/ecg-data.js).
- [`clinical-dashboard/generate_demo_data.py`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/generate_demo_data.py) rebuilds the missing `data/` directory using synthetic records.
- [`OPEN_DASHBOARD.vbs`](/Users/yiz249/Desktop/Dashboard-Damo/OPEN_DASHBOARD.vbs) is a Windows helper that launches the dashboard in Edge or Chrome with local-file access flags.

## Architecture Notes

This is primarily a static HTML dashboard. Most pages:

- load CSV files directly from `clinical-dashboard/data/` using Papa Parse or `fetch`
- render charts with client-side libraries loaded from CDNs
- keep page-specific transformation logic inline inside each HTML file
- share styling through [`clinical-dashboard/assets/css/base.css`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/assets/css/base.css)

There is no build pipeline, package manifest, or backend app in the repo. A few utility scripts exist for SAS-to-CSV conversion and refresh-date generation, but the dashboard itself is designed to run as static files.

## Synthetic Demo Data

The generated dataset is fully fake and intended only for local demo/testing.

It currently creates:

- 200 synthetic patients
- demographics, enrollment, consent, end-of-treatment, and end-of-study records
- adverse events, dose changes, concomitant medications, prior cancer treatment, and medical history
- vital signs, lab results, normalized lab helper tables, ECG/QTcF rows, and mutation rows
- a `refresh-date.json` file so study summary cards still show a recent refresh value

Current generated row counts:

- `dm.CSV`: 200
- `subj.CSV`: 200
- `dmmr.csv`: 200
- `rsecog1.CSV`: 200
- `dsic.CSV`: 200
- `dsen.CSV`: 200
- `dset.CSV`: 200
- `dses.CSV`: 200
- `mh.CSV`: 400
- `mhcan.csv`: 200
- `mhca.csv`: 200
- `vis.CSV`: 1400
- `vs.CSV`: 1400
- `ae.CSV`: 700
- `dd.CSV`: 350
- `cm.csv`: 400
- `cmpc.CSV`: 400
- `lab.CSV`: 16200
- `lblc.CSV`: 16200
- `lblh.CSV`: 16200
- `ecclin.csv`: 200
- `ecad.csv`: 34
- `ecsd.csv`: 20
- `ecmd.csv`: 17
- `dose_change.CSV`: 34
- `Export_ECG_new.csv`: 1000
- `G360_Filtered.csv`: 2960

Key generated files include:

- `dm.CSV`
- `ae.CSV`
- `lab.CSV`
- `lblc.CSV`
- `lblh.CSV`
- `vs.CSV`
- `vis.CSV`
- `Export_ECG_new.csv`
- `G360_Filtered.csv`

The `data/` folder also includes compatibility aliases used by older page references, including:

- `Export_ECG.csv`
- `ecg.csv`
- `dm.sas7bdat` placeholder

## Data Conventions

The synthetic files are shaped to match the original static dashboard as closely as possible. Important conventions:

- Most date columns used by the dashboard are emitted in SAS-like strings such as `02JAN2025:00:00:00.000`.
- Human-readable companion fields are also included where older pages expect them, such as visit or AE raw text like `02 JAN 2025`.
- Lab files include both raw values and normalized helper values:
  - `StdValue`, `StdLow`, `StdHigh` are generated in the same raw-unit style expected by the original lab pages.
  - `NormValue`, `NormStatus`, and `xULN` are included as helper fields for summary and normalized displays.
- Legacy baseline visit aliases such as `SCRN` and `C0D1` are included in the lab history feeds so older CTCAE and worsening-from-baseline pages still work.
- ECG exports include `CollectionDateTime` in addition to `EGDTC` so both older and newer ECG pages can detect a valid datetime column.

Because the repo contains mixed historical references like `dm.CSV` and `dm.csv`, the current setup works best on the default macOS case-insensitive filesystem this project is being used on.

## Generate Data

From the repo root:

```bash
python3 clinical-dashboard/generate_demo_data.py
```

That command creates or refreshes [`clinical-dashboard/data/`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/data).

To run the static compatibility checks after regeneration:

```bash
python3 clinical-dashboard/validate_demo_data.py
```

At the time of this update, validation reports:

- `105` code-to-data file references checked
- `27` curated datasets validated for required columns

## Open The Dashboard

Options:

1. Open [`clinical-dashboard/index.html`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/index.html) directly in a browser.
2. On Windows, use [`OPEN_DASHBOARD.vbs`](/Users/yiz249/Desktop/Dashboard-Damo/OPEN_DASHBOARD.vbs).
3. If local-file loading is blocked by your browser, run a lightweight local server from the repo root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/clinical-dashboard/index.html`.

## Utility Scripts

- [`clinical-dashboard/convert_sas_to_csv.py`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/convert_sas_to_csv.py) converts `data/dm.sas7bdat` to `data/dm.CSV`.
- [`clinical-dashboard/convert_sas_to_csv.js`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/convert_sas_to_csv.js) is a Node alternative for the same conversion path.
- [`clinical-dashboard/get_data_refresh_date.py`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/get_data_refresh_date.py) writes `data/refresh-date.json` using file modification times.
- [`clinical-dashboard/get-data-refresh-date.js`](/Users/yiz249/Desktop/Dashboard-Damo/clinical-dashboard/get-data-refresh-date.js) is the Node version of the refresh-date helper.

## Known Limitations

- Several pages contain highly page-specific transformation logic and expect historical CSV naming conventions.
- Some sections are placeholders or partially scaffolded, especially under `operations`, `pkpd`, and parts of `admin`.
- `sections/efficacy/` is a compatibility addition for missing routes, not a restored original efficacy implementation.
- The synthetic dataset is shaped to support the UI broadly, but it is not a statistical or SDTM-validated study package.
- A few lab and patient-profile pages contain very large inline scripts, so future maintenance will be easier if those are eventually extracted into shared modules.
