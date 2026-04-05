#!/usr/bin/env python3
"""
Generate synthetic demo data for the Clinical Dashboard.

The original production-like data folder was removed for security reasons.
This script rebuilds a compatible `clinical-dashboard/data/` directory using
fully synthetic patient-level records for local demo and UI testing.
"""

from __future__ import annotations

import csv
import json
import math
import random
import shutil
import zipfile
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
RNG = random.Random(30643)

PATIENT_COUNT = 200
START_DATE = datetime(2025, 1, 6)

ARMS = [
    "Dose Level 1 (20 mg)",
    "Dose Level 2 (40 mg)",
    "Dose Level 3 (80 mg)",
    "Dose Level 4 (120 mg)",
    "Dose Expansion (120 mg)",
]
COUNTRIES = ["United States", "Canada", "Australia", "South Korea", "Spain"]
RACES = ["White", "Asian", "Black or African American", "Other"]
ETHNICITIES = ["Not Hispanic or Latino", "Hispanic or Latino"]
ECOG_VALUES = ["0", "1", "2"]
AE_TERMS = [
    ("Nausea", "Gastrointestinal disorders"),
    ("Fatigue", "General disorders"),
    ("Diarrhea", "Gastrointestinal disorders"),
    ("ALT increased", "Investigations"),
    ("AST increased", "Investigations"),
    ("Anemia", "Blood and lymphatic system disorders"),
    ("Neutropenia", "Blood and lymphatic system disorders"),
    ("Rash", "Skin and subcutaneous tissue disorders"),
    ("Headache", "Nervous system disorders"),
    ("Vomiting", "Gastrointestinal disorders"),
]
MH_TERMS = [
    ("Hypertension", "Cardiac disorders"),
    ("Type 2 diabetes mellitus", "Metabolism and nutrition disorders"),
    ("Hyperlipidemia", "Metabolism and nutrition disorders"),
    ("Asthma", "Respiratory disorders"),
    ("Hypothyroidism", "Endocrine disorders"),
]
CM_DRUGS = [
    "Ondansetron",
    "Pantoprazole",
    "Acetaminophen",
    "Loperamide",
    "Dexamethasone",
]
PRIOR_TX = [
    "Platinum chemotherapy",
    "PD-1 inhibitor",
    "EGFR tyrosine kinase inhibitor",
    "Radiation therapy",
]
ANALYTES = {
    "Alanine Aminotransferase; ALT": {"short": "ALT", "unit": "U/L", "lln": 0, "uln": 40},
    "Aspartate Aminotransferase; AST": {"short": "AST", "unit": "U/L", "lln": 0, "uln": 40},
    "Bilirubin; BILI": {"short": "BILI", "unit": "mg/dL", "lln": 0.2, "uln": 1.2},
    "Alkaline Phosphatase; ALP": {"short": "ALP", "unit": "U/L", "lln": 35, "uln": 104},
    "Albumin; ALB": {"short": "ALB", "unit": "g/L", "lln": 35, "uln": 50},
    "Hemoglobin; HGB": {"short": "HGB", "unit": "g/dL", "lln": 12, "uln": 17},
    "Platelets; PLAT": {"short": "PLAT", "unit": "10^9/L", "lln": 150, "uln": 450},
    "Neutrophils; NEUT": {"short": "NEUT", "unit": "10^9/L", "lln": 1.5, "uln": 7.5},
    "Creatinine; CREAT": {"short": "CREAT", "unit": "mg/dL", "lln": 0.6, "uln": 1.3},
}
VISITS = [
    ("SCR", -14, "Screening"),
    ("C1D1", 1, "Cycle 1 Day 1"),
    ("C1D8", 8, "Cycle 1 Day 8"),
    ("C2D1", 29, "Cycle 2 Day 1"),
    ("C3D1", 57, "Cycle 3 Day 1"),
    ("C4D1", 85, "Cycle 4 Day 1"),
    ("DSET", 113, "End of Treatment"),
]
ECG_VISITS = ["C1", "C2", "C3", "C4", "C5"]
MUTATIONS = [
    ("EGFR", "p.L858R", "Likely Pathogenic"),
    ("TP53", "p.R273H", "Likely Pathogenic"),
    ("PIK3CA", "p.E545K", "Likely Pathogenic"),
    ("EGFR", "p.C797S", "Resistance"),
    ("ERBB2", "p.S310F", "VUS"),
]


def fmt_dt(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d")


def fmt_sdtm(dt: datetime) -> str:
    return dt.strftime("%d%b%Y").upper()


def fmt_sas_datetime(dt: datetime) -> str:
    return f"{fmt_sdtm(dt)}:00:00:00.000"


def fmt_day_text(dt: datetime) -> str:
    return dt.strftime("%d %b %Y").upper()


def fmt_collection_datetime(dt: datetime) -> str:
    return dt.strftime("%m/%d/%Y %H:%M")


def posix_ms(dt: datetime) -> int:
    return int(dt.timestamp() * 1000)


def parse_generated_datetime(value: str | int | float | None) -> datetime | None:
    if value is None:
        return None
    raw = str(value).strip()
    if not raw:
        return None
    if raw.isdigit():
        num = int(raw)
        if abs(num) > 10_000_000_000:
            return datetime.fromtimestamp(num / 1000)
    for fmt in ("%d%b%Y:%H:%M:%S.%f", "%d%b%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(raw.upper() if "%b" in fmt else raw, fmt)
        except ValueError:
            continue
    return None


def write_csv(path: Path, rows: list[dict], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def expand_lab_visit_aliases(rows: list[dict]) -> list[dict]:
    alias_map = {
        "SCR": "SCRN",
        "C1D1": "C0D1",
    }
    expanded = list(rows)
    for row in rows:
        folder = str(row.get("Folder", "")).strip().upper()
        alias = alias_map.get(folder)
        if not alias:
            continue
        alias_row = dict(row)
        alias_row["Folder"] = alias
        alias_row["VISIT"] = alias
        alias_row["InstanceName"] = alias
        expanded.append(alias_row)
    return expanded


def excel_col(n: int) -> str:
    out = []
    while n > 0:
        n, rem = divmod(n - 1, 26)
        out.append(chr(65 + rem))
    return "".join(reversed(out))


def write_simple_xlsx(path: Path, rows: list[dict], fieldnames: list[str]) -> None:
    def cell_xml(ref: str, value) -> str:
        if value is None:
            value = ""
        s = str(value)
        if s != "":
            try:
                float(s)
                return f'<c r="{ref}"><v>{escape(s)}</v></c>'
            except ValueError:
                pass
        return f'<c r="{ref}" t="inlineStr"><is><t>{escape(s)}</t></is></c>'

    sheet_rows = []
    header_cells = "".join(cell_xml(f"{excel_col(i)}1", name) for i, name in enumerate(fieldnames, start=1))
    sheet_rows.append(f'<row r="1">{header_cells}</row>')
    for row_idx, row in enumerate(rows, start=2):
        cells = []
        for col_idx, name in enumerate(fieldnames, start=1):
            cells.append(cell_xml(f"{excel_col(col_idx)}{row_idx}", row.get(name, "")))
        sheet_rows.append(f'<row r="{row_idx}">{"".join(cells)}</row>')

    sheet_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        f'<sheetData>{"".join(sheet_rows)}</sheetData>'
        '</worksheet>'
    )

    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(
            "[Content_Types].xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            '<Default Extension="xml" ContentType="application/xml"/>'
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
            '</Types>',
        )
        zf.writestr(
            "_rels/.rels",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            '</Relationships>',
        )
        zf.writestr(
            "xl/workbook.xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
            'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            '<sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>'
            '</workbook>',
        )
        zf.writestr(
            "xl/_rels/workbook.xml.rels",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
            '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
            '</Relationships>',
        )
        zf.writestr(
            "xl/styles.xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            '<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>'
            '<fills count="1"><fill><patternFill patternType="none"/></fill></fills>'
            '<borders count="1"><border/></borders>'
            '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
            '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>'
            '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
            '</styleSheet>',
        )
        zf.writestr("xl/worksheets/sheet1.xml", sheet_xml)


def mean(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def panel_name(analyte_name: str) -> str:
    short = ANALYTES.get(analyte_name, {}).get("short", "")
    if short in {"ALT", "AST", "BILI", "ALP", "ALB"}:
        return "Liver Function"
    if short in {"CREAT"}:
        return "Renal Function"
    if short in {"HGB", "PLAT", "NEUT"}:
        return "Hematology"
    return "Other"


def make_patients() -> list[dict]:
    patients = []
    for i in range(PATIENT_COUNT):
        site = 101 + (i % 10)
        subj_num = 1001 + i
        subjid = f"{site}-{subj_num}"
        usubjid = f"BH-30643-{subjid}"
        consent_date = START_DATE + timedelta(days=i * 2)
        first_dose = consent_date + timedelta(days=RNG.randint(7, 18))
        duration_days = RNG.randint(70, 145)
        end_treatment = first_dose + timedelta(days=duration_days)
        end_study = end_treatment + timedelta(days=RNG.randint(14, 45))
        race = RNG.choice(RACES)
        ethnic = RNG.choice(ETHNICITIES)
        sex = RNG.choice(["Male", "Female"])
        age = RNG.randint(29, 82)
        arm = ARMS[i % len(ARMS)]
        country = COUNTRIES[i % len(COUNTRIES)]
        dthfl = "Y" if i % 25 == 0 else "N"
        if i % 9 == 0:
            eot_reason = "Adverse event"
        elif i % 11 == 0:
            eot_reason = "Progressive disease"
        elif i % 13 == 0:
            eot_reason = "Withdrawal by subject"
        else:
            eot_reason = "Completed treatment"
        eos_reason = "Death" if dthfl == "Y" else ("Lost to follow-up" if i % 17 == 0 else "Study completed")
        patients.append(
            {
                "siteid": str(site),
                "subjid": subjid,
                "usubjid": usubjid,
                "arm": arm,
                "country": country,
                "sex": sex,
                "age": age,
                "race": race,
                "ethnic": ethnic,
                "consent_date": consent_date,
                "first_dose": first_dose,
                "end_treatment": end_treatment,
                "end_study": end_study,
                "dthfl": dthfl,
                "eot_reason": eot_reason,
                "eos_reason": eos_reason,
                "folder": f"P-{i + 1:03d}",
            }
        )
    return patients


def generate() -> dict[str, int]:
    if DATA_DIR.exists():
        for child in DATA_DIR.iterdir():
            if child.is_file():
                child.unlink()

    patients = make_patients()

    dm_rows = []
    subj_rows = []
    dmmr_rows = []
    ecog_rows = []
    dsic_rows = []
    dsen_rows = []
    dset_rows = []
    dses_rows = []
    mh_rows = []
    mhcan_rows = []
    mhca_rows = []
    vs_rows = []
    vis_rows = []
    ae_rows = []
    dd_rows = []
    cm_rows = []
    cmpc_rows = []
    lab_rows = []
    lblc_rows = []
    lblh_rows = []
    dose_change_rows = []
    ecclin_rows = []
    ecsd_rows = []
    ecad_rows = []
    ecmd_rows = []
    ecg_rows = []
    mutation_rows = []

    for idx, p in enumerate(patients):
        birth_date = p["consent_date"] - timedelta(days=int(p["age"] * 365.25))
        sex_code = "F" if p["sex"] == "Female" else "M"
        risk_class = ["Favorable", "Intermediate", "Adverse"][idx % 3]
        race_flags = {
            "WHITE_STD": "Y" if p["race"] == "White" else "N",
            "BLACK_STD": "Y" if p["race"] == "Black or African American" else "N",
            "ASIAN_STD": "Y" if p["race"] == "Asian" else "N",
            "AMERICAN_INDIAN_STD": "Y" if p["race"] == "American Indian or Alaska Native" else "N",
            "NATIVE_HAWAIIAN_STD": "N",
            "OTHER_STD": "Y" if p["race"] == "Other" else "N",
        }
        dm_rows.append(
            {
                "STUDYID": "BH-30643",
                "SITEID": p["siteid"],
                "SUBJID": p["subjid"],
                "USUBJID": p["usubjid"],
                "ARM": p["arm"],
                "COUNTRY": p["country"],
                "SEX": p["sex"],
                "SEX_STD": p["sex"],
                "AGE": p["age"],
                "RACE": p["race"],
                "ETHNIC": p["ethnic"],
                "ETHNIC_STD": p["ethnic"],
                "RFICDTC": fmt_dt(p["consent_date"]),
                "RFXSTDTC": fmt_dt(p["first_dose"]),
                "RFXENDTC": fmt_dt(p["end_treatment"]),
                "TRTSDT": fmt_dt(p["first_dose"]),
                "DTHFL": p["dthfl"],
                "FOLDER": p["folder"],
                "CSV": "dm.CSV",
                **race_flags,
            }
        )
        subj_rows.append({"SUBJID": p["subjid"], "USUBJID": p["usubjid"], "ARM": p["arm"], "CSV": "subj.CSV"})
        dmmr_rows.append(
            {
                "Subject": p["subjid"],
                "SUBJID": p["subjid"],
                "USUBJID": p["usubjid"],
                "AGE": p["age"],
                "SEX_STD": sex_code,
                "SEX": sex_code,
                "ETHNIC": p["ethnic"],
                "ETHNIC_STD": p["ethnic"],
                "Site": p["siteid"],
                "siteid": p["siteid"],
                "SITE": p["siteid"],
                "SiteNumber": p["siteid"],
                "StudyEnvSiteNumber": p["siteid"],
                "SITENUM": p["siteid"],
                "BRTHDTC": fmt_dt(birth_date),
                "BRTHDAT": fmt_dt(birth_date),
                "BRTHYY_INT": posix_ms(birth_date),
                "ELNRISKCAT_STD": risk_class,
                "ELNRISKCAT": risk_class,
                "ELN_RISK": risk_class,
                "RiskCategory": risk_class,
                "RSDAT": fmt_sas_datetime(p["consent_date"]),
                "RSDAT_RAW": fmt_day_text(p["consent_date"]),
                "RSDAT_INT": fmt_sas_datetime(p["consent_date"]),
                **race_flags,
            }
        )
        ecog_rows.append(
            {
                "Subject": p["subjid"],
                "SUBJID": p["subjid"],
                "USUBJID": p["usubjid"],
                "Folder": "SCRN",
                "ECOG101_RSSTRESC_STD": ECOG_VALUES[idx % len(ECOG_VALUES)],
                "RSDAT": fmt_sas_datetime(p["first_dose"]),
                "RSDAT_INT": fmt_sas_datetime(p["first_dose"]),
                "RSDAT_RAW": fmt_day_text(p["first_dose"]),
            }
        )
        dsic_rows.append(
            {
                "Subject": p["subjid"],
                "SUBJID": p["subjid"],
                "USUBJID": p["usubjid"],
                "FolderName": "Screening",
                "PROTVER": "Amendment 3",
                "PROTVER_STD": "Amendment 3",
                "RFICYN_STD": "Y",
                "RFICYN1_STD": "Y",
                "RFICYN2_STD": "N" if idx % 8 else "Y",
                "CURPVFL_STD": "Y" if idx % 3 else "N",
                "TXYN_STD": "Y",
                "DSSTDAT_INT": fmt_sas_datetime(p["consent_date"]),
                "DSSTDAT1_INT": fmt_sas_datetime(p["consent_date"] + timedelta(days=1)),
            }
        )
        dsen_rows.append(
            {
                "Subject": p["subjid"],
                "SUBJID": p["subjid"],
                "USUBJID": p["usubjid"],
                "DSDECOD": "ENROLLED",
                "DSSTDAT_INT": fmt_sas_datetime(p["first_dose"]),
                "ARM": p["arm"],
            }
        )
        dset_rows.append(
            {
                "Subject": p["subjid"],
                "SUBJID": p["subjid"],
                "USUBJID": p["usubjid"],
                "DSSTDAT_INT": fmt_sas_datetime(p["end_treatment"]),
                "DSET_DSDECOD": p["eot_reason"],
                "DSET_DSDECOD_STD": p["eot_reason"],
                "DSCONT": p["eot_reason"],
                "DSCONT_STD": p["eot_reason"],
                "DSTERM": "Synthetic demo record",
                "DSAENO": "Y" if p["eot_reason"] == "Adverse event" else "N",
                "DSAENO_STD": "Y" if p["eot_reason"] == "Adverse event" else "N",
                "DSDOSE1_INT": idx % 4 + 1,
                "DSETDAT_RAW": fmt_day_text(p["end_treatment"]),
            }
        )
        dses_rows.append(
            {
                "Subject": p["subjid"],
                "SUBJID": p["subjid"],
                "USUBJID": p["usubjid"],
                "DSSTDAT_INT": fmt_sas_datetime(p["end_study"]),
                "DSES_DSDECOD": p["eos_reason"],
                "DSES_DSDECOD_STD": p["eos_reason"],
                "DSTERM": "Synthetic end-of-study disposition",
                "DSAENO": "Y" if p["eos_reason"] == "Death" else "N",
                "DSAENO_STD": "Y" if p["eos_reason"] == "Death" else "N",
                "DSESDAT_RAW": fmt_day_text(p["end_study"]),
            }
        )

        for mh_idx in range(2):
            term, soc = MH_TERMS[(idx + mh_idx) % len(MH_TERMS)]
            mh_start = p["consent_date"] - timedelta(days=RNG.randint(200, 2500))
            ongoing = "Y" if mh_idx == 0 else "N"
            mh_rows.append(
                {
                    "Subject": p["subjid"],
                    "SUBJID": p["subjid"],
                    "USUBJID": p["usubjid"],
                    "MHTERM": term,
                    "MHTERM_pt": term,
                    "MHTERM_soc": soc,
                    "MHTERM_hlt": soc,
                    "MHTERM_hlgt": soc,
                    "MHCAT": "MEDICAL HISTORY",
                    "MHCAT_STD": "MEDICAL HISTORY",
                    "MHYN_STD": "Y",
                    "MHONGO_STD": ongoing,
                    "MHTOXGR_STD": "",
                    "MHSTDAT_INT": fmt_sas_datetime(mh_start),
                    "MHENDAT_INT": "" if ongoing == "Y" else fmt_sas_datetime(p["consent_date"] - timedelta(days=30)),
                    "CSV": "mh.CSV",
                }
            )
        mhcan_rows.append(
            {
                "Subject": p["subjid"],
                "SUBJID": p["subjid"],
                "USUBJID": p["usubjid"],
                "MHTERM1_STD": MH_TERMS[idx % len(MH_TERMS)][0],
                "MHTERM1": MH_TERMS[idx % len(MH_TERMS)][0],
                "MHTERM": MH_TERMS[idx % len(MH_TERMS)][0],
                "MHCAT_STD": "Primary diagnosis",
                "MHCAT": "Primary diagnosis",
                "ELNRISKCAT_STD": risk_class,
                "ELNRISKCAT": risk_class,
                "ELN_RISK": risk_class,
                "RiskCategory": risk_class,
            }
        )
        mhca_rows.append(
            {
                "Subject": p["subjid"],
                "SUBJID": p["subjid"],
                "USUBJID": p["usubjid"],
                "MHCAT_STD": "Disease characteristics",
                "MHCAT": "Disease characteristics",
                "ELNRISKCAT_STD": risk_class,
                "ELNRISKCAT": risk_class,
                "ELN_RISK": risk_class,
                "RiskCategory": risk_class,
            }
        )

        height_cm = RNG.randint(150, 192)
        weight_kg = round(RNG.uniform(48, 108), 1)
        for visit_code, study_day, visit_label in VISITS:
            dt = p["first_dose"] + timedelta(days=study_day - 1 if study_day > 0 else study_day)
            sysbp = RNG.randint(102, 146)
            diabp = RNG.randint(64, 92)
            hr = RNG.randint(58, 104)
            resp = RNG.randint(12, 20)
            vs_rows.append(
                {
                    "Subject": p["subjid"],
                    "SUBJECT": p["subjid"],
                    "SUBJID": p["subjid"],
                    "USUBJID": p["usubjid"],
                    "Folder": visit_code,
                    "VISIT": visit_label,
                    "VSDTC": fmt_sas_datetime(dt),
                    "VSDAT_INT": fmt_sas_datetime(dt),
                    "SYSBP_VSORRES": sysbp,
                    "SYSBP_VSORRESU": "mmHg",
                    "DIABP_VSORRES": diabp,
                    "DIABP_VSORRESU": "mmHg",
                    "HR_VSORRES": hr,
                    "HR_VSORRESU": "beats/min",
                    "RESP_VSORRES": resp,
                    "RESP_VSORRESU": "breaths/min",
                    "HEIGHT_VSORRES_STD": height_cm if visit_code == "SCR" else "",
                    "WEIGHT_VSORRES_STD": weight_kg if visit_code == "SCR" else "",
                }
            )
            vis_rows.append(
                {
                    "SUBJECT": p["subjid"],
                    "Subject": p["subjid"],
                    "SUBJID": p["subjid"],
                    "USUBJID": p["usubjid"],
                    "FOLDER": visit_code,
                    "Folder": visit_code,
                    "VISDAT": fmt_sas_datetime(dt),
                    "VISDAT_1": fmt_sas_datetime(dt),
                    "VISDAT_1_RAW": fmt_day_text(dt),
                    "VISDAT_INT": fmt_sas_datetime(dt),
                    "SVOCCUR": "Y",
                    "SVOCCUR_1": "Y",
                    "Occurred": "Y",
                    "SVREASOC": "",
                    "SVREASOC_1": "",
                    "Reason": "",
                }
            )

        subject_ae_count = 2 + (idx % 4)
        for ae_idx in range(subject_ae_count):
            term, soc = AE_TERMS[(idx + ae_idx) % len(AE_TERMS)]
            ae_start = p["first_dose"] + timedelta(days=RNG.randint(0, 85))
            ae_end = ae_start + timedelta(days=RNG.randint(1, 18))
            grade = 1 + ((idx + ae_idx) % 4)
            serious = "Y" if grade >= 3 and ae_idx == 0 and idx % 5 == 0 else "N"
            related = "Possibly Related" if ae_idx % 3 else "Not Related"
            ae_rows.append(
                {
                    "SUBJID": p["subjid"],
                    "USUBJID": p["usubjid"],
                    "SUBJECT": p["subjid"],
                    "ARM": p["arm"],
                    "AETERM": term,
                    "AETERM_pt": term,
                    "AETERM_soc": soc,
                    "AEDECOD": term.upper(),
                    "AESTDTC": fmt_sas_datetime(ae_start),
                    "AESTDAT_INT": fmt_sas_datetime(ae_start),
                    "AESTDAT_RAW": fmt_day_text(ae_start),
                    "AEENDTC": fmt_sas_datetime(ae_end),
                    "AEENDAT_INT": fmt_sas_datetime(ae_end),
                    "AEENDAT_RAW": fmt_day_text(ae_end),
                    "AETOXGR": f"Grade {grade}",
                    "AETOXGR_STD": str(grade),
                    "AESER": serious,
                    "AESER_STD": serious,
                    "AEREL": related,
                    "AEREL_STD": related,
                    "AEACN": "DOSE REDUCED" if grade >= 3 else "NONE",
                    "AEACN_STD": "DOSE REDUCED" if grade >= 3 else "NONE",
                    "AEOUT": "RECOVERED/RESOLVED" if ae_idx % 4 else "RECOVERING/RESOLVING",
                    "AEOUT_STD": "RECOVERED/RESOLVED" if ae_idx % 4 else "RECOVERING/RESOLVING",
                    "AEONGO": "N",
                    "AEONGO_STD": "N",
                    "AESEV": "MILD" if grade == 1 else "MODERATE" if grade == 2 else "SEVERE",
                    "AECONTRT": "N",
                    "AECONTRT_STD": "N",
                    "AEPATT": "INTERMITTENT",
                    "AEPATT_STD": "INTERMITTENT",
                    "AEDIS_STD": "NO",
                    "AEDLT_1": "Y" if grade >= 3 and idx % 7 == 0 else "N",
                    "AEDLT_1_STD": "Y" if grade >= 3 and idx % 7 == 0 else "N",
                    "CSV": "ae.CSV",
                }
            )
            if grade >= 3:
                dd_rows.append(
                    {
                        "SUBJID": p["subjid"],
                        "USUBJID": p["usubjid"],
                        "DDDAT_INT": fmt_sas_datetime(ae_start + timedelta(days=2)),
                        "DDEVAL": "Dose reduction",
                        "AUTOPIND_DDORRES": "Y",
                        "PRCDTH_DDORRES_STD": "Adverse event",
                        "OTHER_PRCDTH_DDORRES": term,
                    }
                )

        cm_start = p["first_dose"] - timedelta(days=7)
        for cm_idx in range(2):
            drug = CM_DRUGS[(idx + cm_idx) % len(CM_DRUGS)]
            start = cm_start + timedelta(days=cm_idx * 14)
            end = start + timedelta(days=RNG.randint(10, 45))
            cm_rows.append(
                {
                    "Subject": p["subjid"],
                    "SUBJID": p["subjid"],
                    "USUBJID": p["usubjid"],
                    "CMTRT": drug,
                    "CMCAT": "CONCOMITANT MEDICATION",
                    "CMDSTXT": "10",
                    "CMDOSFRQ": "QD",
                    "CMDOSFRQ_STD": "QD",
                    "CMDOSU": "mg",
                    "CMDOSU_STD": "mg",
                    "CMROUTE": "ORAL",
                    "CMROUTE_STD": "ORAL",
                    "CMREAS": "Supportive care",
                    "CMSTDAT_INT": fmt_sas_datetime(start),
                    "CMENDAT_INT": fmt_sas_datetime(end),
                    "CMONGO": "N",
                    "CMAENO": "N",
                    "CMAENO_STD": "N",
                }
            )

        for tx_idx in range(2):
            start = p["consent_date"] - timedelta(days=RNG.randint(120, 900))
            end = start + timedelta(days=RNG.randint(45, 180))
            tx = PRIOR_TX[(idx + tx_idx) % len(PRIOR_TX)]
            cmpc_rows.append(
                {
                    "SUBJECT": p["subjid"],
                    "FOLDER": p["folder"],
                    "CMTRT": tx,
                    "CMTRT_product": tx,
                    "CMSCAT": "PRIOR ANTI-CANCER THERAPY",
                    "CMSCAT_STD": "PRIOR ANTI-CANCER THERAPY",
                    "CMSTDAT": fmt_dt(start),
                    "CMSTDAT_INT": fmt_sas_datetime(start),
                    "CMENDAT": fmt_dt(end),
                    "CMENDAT_INT": fmt_sas_datetime(end),
                    "TRTSTT": "COMPLETED",
                    "TRTSTT_STD": "COMPLETED",
                }
            )

        dose_end = p["end_treatment"]
        ecclin_rows.append(
            {
                "Subject": p["subjid"],
                "ECSTDAT_INT": fmt_sas_datetime(p["first_dose"]),
                "ECENDAT_INT": fmt_sas_datetime(dose_end),
                "ECDSTXT": str(20 * (1 + (idx % 4))),
                "ECDOSFRQ_STD": "QD",
            }
        )
        if idx % 6 == 0:
            ecad_rows.append(
                {
                    "Subject": p["subjid"],
                    "ECSTDAT_INT": fmt_sas_datetime(p["first_dose"] + timedelta(days=35)),
                    "ECENDAT_INT": fmt_sas_datetime(dose_end),
                    "ECDSTXT": str(10 * (1 + (idx % 4))),
                    "ECDOSFRQ_STD": "QD",
                }
            )
            dose_change_rows.append(
                {
                    "SUBJID": p["subjid"],
                    "Subject": p["subjid"],
                    "Initial_Dose": 20 * (1 + (idx % 4)),
                    "Change_Date": fmt_dt(p["first_dose"] + timedelta(days=35)),
                    "Change_Reason": "Toxicity management",
                }
            )
        if idx % 10 == 0:
            ecsd_rows.append(
                {
                    "Subject": p["subjid"],
                    "ECSTDAT_INT": fmt_sas_datetime(p["first_dose"] + timedelta(days=21)),
                    "ECENDAT_INT": fmt_sas_datetime(p["first_dose"] + timedelta(days=24)),
                    "ECDSTXT": "0",
                    "ECDOSFRQ_STD": "HOLD",
                }
            )
        if idx % 12 == 0:
            ecmd_rows.append(
                {
                    "Subject": p["subjid"],
                    "ECSTDAT_INT": fmt_sas_datetime(p["first_dose"] + timedelta(days=49)),
                    "ECENDAT_INT": fmt_sas_datetime(p["first_dose"] + timedelta(days=49)),
                    "ECDSTXT": "0",
                    "ECDOSFRQ_STD": "MISSED",
                }
            )

        baseline_values = {}
        for analyte_name, cfg in ANALYTES.items():
            baseline = cfg["uln"] * RNG.uniform(0.55, 0.95) if cfg["short"] not in {"PLAT", "NEUT"} else cfg["lln"] * RNG.uniform(1.05, 1.7)
            baseline_values[analyte_name] = baseline
            for visit_code, study_day, _ in VISITS:
                dt = p["first_dose"] + timedelta(days=study_day - 1 if study_day > 0 else study_day)
                drift = 1 + 0.08 * math.sin((idx + study_day + len(analyte_name)) / 10)
                if cfg["short"] in {"ALT", "AST"} and idx % 15 == 0 and study_day >= 29:
                    drift *= 2.4
                if cfg["short"] == "BILI" and idx % 20 == 0 and study_day >= 29:
                    drift *= 2.1
                if cfg["short"] == "ALB" and study_day >= 57:
                    drift *= 0.92
                if cfg["short"] in {"PLAT", "NEUT"} and idx % 18 == 0 and study_day >= 8:
                    drift *= 0.55
                raw_value = round(baseline * drift, 2)
                std_value = round(raw_value / cfg["uln"], 3) if cfg["uln"] else raw_value
                row = {
                    "Subject": p["subjid"],
                    "SUBJID": p["subjid"],
                    "USUBJID": p["usubjid"],
                    "ARM": p["arm"],
                    "Folder": visit_code,
                    "VISIT": visit_code,
                    "InstanceName": visit_code,
                    "RecordDate": fmt_sas_datetime(dt),
                    "LBDTC": fmt_sas_datetime(dt),
                    "LBDAT": fmt_sdtm(dt),
                    "LBDAT_INT": fmt_sas_datetime(dt),
                    "LBDAT_INT_POSIX": posix_ms(dt),
                    "StudyDay": study_day,
                    "AnalyteName": analyte_name,
                    "LBTEST": analyte_name,
                    "LBORRES": raw_value,
                    "NumericValue": raw_value,
                    "LabValue": raw_value,
                    "LBORRESU": cfg["unit"],
                    "LabUnits": cfg["unit"],
                    "StdValue": raw_value,
                    "StdUnits": cfg["unit"],
                    "LBORNRLO": cfg["lln"],
                    "LBORNRHI": cfg["uln"],
                    "LabLow": cfg["lln"],
                    "LabHigh": cfg["uln"],
                    "LLN": cfg["lln"],
                    "ULN": cfg["uln"],
                    "StdLow": cfg["lln"],
                    "StdHigh": cfg["uln"],
                    "BILI_LBORRES": raw_value if cfg["short"] == "BILI" else "",
                    "CSV": "lab.CSV",
                }
                lab_rows.append(row)
                lblc_rows.append(dict(row))
                lblh_rows.append(dict(row))

        qtcf_baseline = mean([RNG.randint(405, 445) for _ in range(3)])
        for v_idx, visit in enumerate(ECG_VISITS, start=1):
            dt = p["first_dose"] + timedelta(days=(v_idx - 1) * 21)
            value = round(qtcf_baseline + RNG.uniform(-8, 24) + (12 if idx % 16 == 0 and v_idx >= 3 else 0), 1)
            ecg_rows.append(
                {
                    "Subject": p["subjid"],
                    "SUBJID": p["subjid"],
                    "USUBJID": p["usubjid"],
                    "Visit": visit,
                    "EGDTC": fmt_dt(dt),
                    "CollectionDateTime": fmt_collection_datetime(dt),
                    "QTcF Value": value,
                    "QTcF Baseline Mean": round(qtcf_baseline, 1),
                    "QTcF Change from Base": round(value - qtcf_baseline, 1),
                    "PR Interval": round(RNG.uniform(140, 190), 1),
                    "QRS Duration": round(RNG.uniform(80, 115), 1),
                    "Heart Rate": round(RNG.uniform(58, 98), 1),
                }
            )

        for mut_idx, (gene, phgvs, category) in enumerate(MUTATIONS[: 3 + (idx % 2)]):
            baseline_af = round(max(0.01, RNG.uniform(0.3, 12.0) / (1 + mut_idx * 0.35)), 2)
            for visit_num in range(1, 5):
                af = baseline_af if visit_num == 1 else round(max(0.01, baseline_af * RNG.uniform(0.15, 1.10)), 2)
                mutation_rows.append(
                    {
                        "Subject": p["subjid"],
                        "SUBJID": p["subjid"],
                        "Visit": f"C{visit_num}",
                        "Gene": gene,
                        "p.HGVS": phgvs,
                        "c.HGVS": f"c.{100 + mut_idx}A>G",
                        "AF": af,
                        "Mutation Category": category,
                        "ARM": p["arm"],
                    }
                )
        if idx % 5 == 0:
            for visit_num in range(1, 5):
                mutation_rows.append(
                    {
                        "Subject": p["subjid"],
                        "SUBJID": p["subjid"],
                        "Visit": f"C{visit_num}",
                        "Gene": "EGFR",
                        "p.HGVS": "p.C797S",
                        "c.HGVS": "c.2390G>C",
                        "AF": round(0.01 if visit_num >= 3 else RNG.uniform(0.2, 2.0), 2),
                        "Mutation Category": "Resistance",
                        "ARM": p["arm"],
                    }
                )

    for row in dm_rows:
        row.update(
            {
                "Subject": row["SUBJID"],
                "Arm": row["ARM"],
                "Site": row["SITEID"],
                "SiteNumber": row["SITEID"],
                "StudyEnvSiteNumber": row["SITEID"],
                "StudySiteId": row["SITEID"],
            }
        )

    for row in subj_rows:
        site = row["SUBJID"].split("-")[0]
        row.update(
            {
                "Subject": row["SUBJID"],
                "ARM": row["ARM"],
                "Arm": row["ARM"],
                "Site": site,
                "SiteNumber": site,
                "StudyEnvSiteNumber": site,
                "StudySiteId": site,
                "subjectId": row["SUBJID"],
            }
        )

    for row in ae_rows:
        start = parse_generated_datetime(row["AESTDAT_INT"])
        end = parse_generated_datetime(row["AEENDAT_INT"])
        duration = (end - start).days if start and end else ""
        row.update(
            {
                "Subject": row["SUBJECT"],
                "AETERM_STD": row["AETERM_pt"],
                "Grade": row["AETOXGR_STD"],
                "Serious": row["AESER_STD"],
                "Relatedness": row["AEREL_STD"],
                "Outcome": row["AEOUT_STD"],
                "Ongoing": row["AEONGO_STD"],
                "DLT": row["AEDLT_1_STD"],
                "TRAE": "N" if row["AEREL_STD"] == "Not Related" else "Y",
                "AE_Duration": duration,
                "Study_days": duration,
            }
        )

    for row in dd_rows:
        row.update(
            {
                "Dose": row["DDEVAL"],
                "Evaluation": row["DDEVAL"],
                "Reason": row["PRCDTH_DDORRES_STD"],
            }
        )

    for row in cm_rows:
        row.update(
            {
                "Medication": row["CMTRT"],
                "Dose": row["CMDSTXT"],
                "Frequency": row["CMDOSFRQ_STD"],
                "Route": row["CMROUTE_STD"],
                "Reason": row["CMREAS"],
                "StartDate": row["CMSTDAT_INT"],
                "EndDate": row["CMENDAT_INT"],
            }
        )

    for row in cmpc_rows:
        row.update(
            {
                "Subject": row["SUBJECT"],
                "Folder": row["FOLDER"],
                "Medication": row["CMTRT"],
                "Therapy": row["CMTRT_product"],
                "StartDate": row["CMSTDAT"],
                "EndDate": row["CMENDAT"],
                "Line": "1L",
                "Cycle": "Prior",
                "RecordPosition": "1",
                "Settings": "Synthetic demo",
            }
        )

    for row in vs_rows:
        row["CSV"] = "vs.CSV"

    for row in vis_rows:
        row["CSV"] = "vis.CSV"

    for row in dsic_rows:
        site = row["SUBJID"].split("-")[0]
        row.update({"Site": site, "SiteNumber": site, "CSV": "dsic.CSV"})

    for row in dsen_rows:
        row["CSV"] = "dsen.CSV"

    for row in dset_rows:
        row["CSV"] = "dset.CSV"

    for row in dses_rows:
        row["CSV"] = "dses.CSV"

    for rows in (lab_rows, lblc_rows, lblh_rows):
        for row in rows:
            value = row["NumericValue"]
            low = row["LabLow"]
            high = row["LabHigh"]
            row.update(
                {
                    "FormName": panel_name(row["AnalyteName"]),
                    "ClinSigValue": "",
                    "Value": value,
                    "Low": low,
                    "High": high,
                    "Units": row["LabUnits"],
                    "NormValue": round(value / high, 3) if high else "",
                    "NormStatus": "HIGH" if high and value > high else "LOW" if low and value < low else "NORMAL",
                    "UseStandard": "Y",
                    "IsHardcoded": "N",
                    "xULN": round(value / high, 3) if high else "",
                }
            )

    lab_rows = expand_lab_visit_aliases(lab_rows)
    lblc_rows = expand_lab_visit_aliases(lblc_rows)
    lblh_rows = expand_lab_visit_aliases(lblh_rows)

    for row in ecg_rows:
        row.update(
            {
                "Folder": row["Visit"],
                "FOLDER": row["Visit"],
                "QTcF": row["QTcF Value"],
                "QTcF Change from Baseline": row["QTcF Change from Base"],
                "DateTime": row["EGDTC"],
            }
        )

    for row in mutation_rows:
        row.update(
            {
                "GENE": row["Gene"],
                "VISIT": row["Visit"],
                "Af": row["AF"],
                "pHGVS": row["p.HGVS"],
                "cHGVS": row["c.HGVS"],
                "Category": row["Mutation Category"],
            }
        )

    write_csv(DATA_DIR / "dm.CSV", dm_rows, list(dm_rows[0].keys()))
    write_csv(DATA_DIR / "subj.CSV", subj_rows, list(subj_rows[0].keys()))
    write_csv(DATA_DIR / "dmmr.csv", dmmr_rows, list(dmmr_rows[0].keys()))
    write_csv(DATA_DIR / "rsecog1.CSV", ecog_rows, list(ecog_rows[0].keys()))
    write_csv(DATA_DIR / "dsic.CSV", dsic_rows, list(dsic_rows[0].keys()))
    write_csv(DATA_DIR / "dsen.CSV", dsen_rows, list(dsen_rows[0].keys()))
    write_csv(DATA_DIR / "dset.CSV", dset_rows, list(dset_rows[0].keys()))
    write_csv(DATA_DIR / "dses.CSV", dses_rows, list(dses_rows[0].keys()))
    write_csv(DATA_DIR / "mh.CSV", mh_rows, list(mh_rows[0].keys()))
    write_csv(DATA_DIR / "mhcan.csv", mhcan_rows, list(mhcan_rows[0].keys()))
    write_csv(DATA_DIR / "mhca.csv", mhca_rows, list(mhca_rows[0].keys()))
    write_csv(DATA_DIR / "vs.CSV", vs_rows, list(vs_rows[0].keys()))
    write_csv(DATA_DIR / "vis.CSV", vis_rows, list(vis_rows[0].keys()))
    write_csv(DATA_DIR / "ae.CSV", ae_rows, list(ae_rows[0].keys()))
    write_csv(DATA_DIR / "dd.CSV", dd_rows, list(dd_rows[0].keys()))
    write_csv(DATA_DIR / "cm.csv", cm_rows, list(cm_rows[0].keys()))
    write_csv(DATA_DIR / "cmpc.CSV", cmpc_rows, list(cmpc_rows[0].keys()))
    write_csv(DATA_DIR / "lab.CSV", lab_rows, list(lab_rows[0].keys()))
    write_csv(DATA_DIR / "lblc.CSV", lblc_rows, list(lblc_rows[0].keys()))
    write_csv(DATA_DIR / "lblh.CSV", lblh_rows, list(lblh_rows[0].keys()))
    write_csv(DATA_DIR / "dose_change.CSV", dose_change_rows or [{"SUBJID": "", "Subject": "", "Initial_Dose": "", "Change_Date": "", "Change_Reason": ""}], ["SUBJID", "Subject", "Initial_Dose", "Change_Date", "Change_Reason"])
    write_csv(DATA_DIR / "ecclin.csv", ecclin_rows, list(ecclin_rows[0].keys()))
    write_csv(DATA_DIR / "ecsd.csv", ecsd_rows or [{"Subject": "", "ECSTDAT_INT": "", "ECENDAT_INT": "", "ECDSTXT": "", "ECDOSFRQ_STD": ""}], ["Subject", "ECSTDAT_INT", "ECENDAT_INT", "ECDSTXT", "ECDOSFRQ_STD"])
    write_csv(DATA_DIR / "ecad.csv", ecad_rows or [{"Subject": "", "ECSTDAT_INT": "", "ECENDAT_INT": "", "ECDSTXT": "", "ECDOSFRQ_STD": ""}], ["Subject", "ECSTDAT_INT", "ECENDAT_INT", "ECDSTXT", "ECDOSFRQ_STD"])
    write_csv(DATA_DIR / "ecmd.csv", ecmd_rows or [{"Subject": "", "ECSTDAT_INT": "", "ECENDAT_INT": "", "ECDSTXT": "", "ECDOSFRQ_STD": ""}], ["Subject", "ECSTDAT_INT", "ECENDAT_INT", "ECDSTXT", "ECDOSFRQ_STD"])
    write_csv(DATA_DIR / "Export_ECG_new.csv", ecg_rows, list(ecg_rows[0].keys()))
    write_csv(DATA_DIR / "G360_Filtered.csv", mutation_rows, list(mutation_rows[0].keys()))
    write_simple_xlsx(DATA_DIR / "Export_ECG_new.xlsx", ecg_rows, list(ecg_rows[0].keys()))
    (DATA_DIR / "dm.sas7bdat").write_text("Synthetic placeholder. Use dm.CSV for the demo dataset.\n", encoding="utf-8")

    refresh_payload = {
        "date": datetime.now().isoformat(),
        "formattedDate": datetime.now().strftime("%m/%d/%Y"),
        "timestamp": int(datetime.now().timestamp() * 1000),
        "source": "Synthetic demo data",
    }
    (DATA_DIR / "refresh-date.json").write_text(json.dumps(refresh_payload, indent=2), encoding="utf-8")

    alias_pairs = [
        ("dm.CSV", "dm.csv"),
        ("ae.CSV", "ae.csv"),
        ("lab.CSV", "lab.csv"),
        ("lblc.CSV", "lblc.csv"),
        ("lblh.CSV", "lblh.csv"),
        ("vs.CSV", "vs.csv"),
        ("vis.CSV", "vis.csv"),
        ("dsen.CSV", "dsen.csv"),
        ("dset.CSV", "dset.csv"),
        ("dses.CSV", "dses.csv"),
        ("dsic.CSV", "dsic.csv"),
        ("rsecog1.CSV", "rsecog1.csv"),
        ("subj.CSV", "subj.csv"),
        ("dd.CSV", "dd.csv"),
        ("cmpc.CSV", "cmpc.csv"),
        ("dose_change.CSV", "dose_change.csv"),
        ("Export_ECG_new.csv", "ecg.csv"),
        ("Export_ECG_new.csv", "ECG.csv"),
        ("Export_ECG_new.csv", "Export_ECG.csv"),
    ]
    for src_name, dst_name in alias_pairs:
        src = DATA_DIR / src_name
        dst = DATA_DIR / dst_name
        try:
            if src.resolve() == dst.resolve():
                continue
        except FileNotFoundError:
            pass
        try:
            shutil.copyfile(src, dst)
        except shutil.SameFileError:
            continue

    return {
        "patients": len(dm_rows),
        "adverse_events": len(ae_rows),
        "lab_records": len(lab_rows),
        "ecg_records": len(ecg_rows),
        "mutation_records": len(mutation_rows),
    }


if __name__ == "__main__":
    summary = generate()
    print(json.dumps(summary, indent=2))
