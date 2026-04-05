#!/usr/bin/env python3
"""
Validate synthetic demo data against the dashboard codebase.

Checks:
1. Every `data/...` file reference in the codebase exists in `clinical-dashboard/data`.
2. Key curated columns for the main datasets are present.
"""

from __future__ import annotations

import csv
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"

CODE_SUFFIXES = {".html", ".js", ".txt"}

CURATED_COLUMNS = {
    "dm.csv": {
        "SUBJID",
        "USUBJID",
        "ARM",
        "SITEID",
        "RFICDTC",
        "RFXSTDTC",
        "RFXENDTC",
        "TRTSDT",
        "AGE",
        "SEX",
        "SEX_STD",
        "ETHNIC",
        "ETHNIC_STD",
        "DTHFL",
        "Subject",
        "Site",
        "SiteNumber",
        "StudyEnvSiteNumber",
    },
    "subj.csv": {
        "SUBJID",
        "USUBJID",
        "ARM",
        "Subject",
        "Site",
        "SiteNumber",
        "StudyEnvSiteNumber",
        "StudySiteId",
        "subjectId",
    },
    "dmmr.csv": {
        "Subject",
        "SUBJID",
        "USUBJID",
        "AGE",
        "SEX_STD",
        "ETHNIC_STD",
        "Site",
        "SiteNumber",
        "BRTHDTC",
        "ELNRISKCAT_STD",
        "RSDAT_INT",
    },
    "rsecog1.csv": {
        "Subject",
        "SUBJID",
        "USUBJID",
        "Folder",
        "ECOG101_RSSTRESC_STD",
        "RSDAT_INT",
    },
    "dsic.csv": {
        "Subject",
        "SUBJID",
        "USUBJID",
        "FolderName",
        "PROTVER_STD",
        "RFICYN_STD",
        "DSSTDAT_INT",
        "Site",
        "SiteNumber",
    },
    "dsen.csv": {"Subject", "SUBJID", "USUBJID", "DSDECOD", "DSSTDAT_INT", "ARM"},
    "dset.csv": {"Subject", "SUBJID", "USUBJID", "DSSTDAT_INT", "DSET_DSDECOD_STD", "DSAENO_STD", "DSDOSE1_INT"},
    "dses.csv": {"Subject", "SUBJID", "USUBJID", "DSSTDAT_INT", "DSES_DSDECOD_STD", "DSAENO_STD"},
    "mh.csv": {"Subject", "SUBJID", "USUBJID", "MHTERM", "MHTERM_pt", "MHTERM_soc", "MHCAT_STD", "MHONGO_STD"},
    "mhcan.csv": {"Subject", "SUBJID", "USUBJID", "MHTERM1_STD", "MHCAT_STD", "ELNRISKCAT_STD"},
    "mhca.csv": {"Subject", "SUBJID", "USUBJID", "MHCAT_STD", "ELNRISKCAT_STD"},
    "vs.csv": {
        "Subject",
        "SUBJECT",
        "SUBJID",
        "USUBJID",
        "Folder",
        "VSDAT_INT",
        "HEIGHT_VSORRES_STD",
        "WEIGHT_VSORRES_STD",
        "SYSBP_VSORRES",
        "DIABP_VSORRES",
        "HR_VSORRES",
        "RESP_VSORRES",
    },
    "vis.csv": {
        "Subject",
        "SUBJECT",
        "SUBJID",
        "USUBJID",
        "Folder",
        "VISDAT",
        "VISDAT_1",
        "VISDAT_INT",
        "SVOCCUR",
        "SVOCCUR_1",
        "SVREASOC",
        "SVREASOC_1",
    },
    "ae.csv": {
        "Subject",
        "SUBJECT",
        "SUBJID",
        "USUBJID",
        "ARM",
        "AETERM",
        "AETERM_pt",
        "AETERM_STD",
        "AESTDAT_INT",
        "AEENDAT_INT",
        "AETOXGR_STD",
        "AESER_STD",
        "AEREL_STD",
        "AEOUT_STD",
        "AE_Duration",
        "Study_days",
        "TRAE",
        "DLT",
    },
    "dd.csv": {"SUBJID", "USUBJID", "DDDAT_INT", "DDEVAL", "PRCDTH_DDORRES_STD"},
    "cm.csv": {
        "Subject",
        "SUBJID",
        "USUBJID",
        "CMTRT",
        "CMCAT",
        "CMDSTXT",
        "CMDOSFRQ_STD",
        "CMDOSU_STD",
        "CMROUTE_STD",
        "CMREAS",
        "CMSTDAT_INT",
        "CMENDAT_INT",
    },
    "cmpc.csv": {
        "Subject",
        "SUBJECT",
        "Folder",
        "FOLDER",
        "CMTRT",
        "CMTRT_product",
        "CMSTDAT",
        "CMENDAT",
        "TRTSTT_STD",
        "Medication",
        "Therapy",
    },
    "lab.csv": {
        "Subject",
        "SUBJID",
        "USUBJID",
        "ARM",
        "Folder",
        "InstanceName",
        "RecordDate",
        "LBDAT_INT",
        "LBDAT_INT_POSIX",
        "StudyDay",
        "AnalyteName",
        "LBTEST",
        "NumericValue",
        "LabLow",
        "LabHigh",
        "LabUnits",
        "StdValue",
        "StdLow",
        "StdHigh",
        "FormName",
        "ClinSigValue",
        "Value",
        "Low",
        "High",
        "NormValue",
        "NormStatus",
        "xULN",
    },
    "lblc.csv": {
        "Subject",
        "AnalyteName",
        "Folder",
        "LBDAT_INT",
        "NumericValue",
        "LabLow",
        "LabHigh",
        "StdValue",
        "StdLow",
        "StdHigh",
        "FormName",
        "xULN",
    },
    "lblh.csv": {
        "Subject",
        "AnalyteName",
        "Folder",
        "LBDAT_INT",
        "NumericValue",
        "LabLow",
        "LabHigh",
        "StdValue",
        "StdLow",
        "StdHigh",
        "FormName",
        "xULN",
    },
    "dose_change.csv": {"SUBJID", "Subject", "Initial_Dose", "Change_Date", "Change_Reason"},
    "ecclin.csv": {"Subject", "ECSTDAT_INT", "ECENDAT_INT", "ECDSTXT", "ECDOSFRQ_STD"},
    "ecsd.csv": {"Subject", "ECSTDAT_INT", "ECENDAT_INT", "ECDSTXT", "ECDOSFRQ_STD"},
    "ecad.csv": {"Subject", "ECSTDAT_INT", "ECENDAT_INT", "ECDSTXT", "ECDOSFRQ_STD"},
    "ecmd.csv": {"Subject", "ECSTDAT_INT", "ECENDAT_INT", "ECDSTXT", "ECDOSFRQ_STD"},
    "export_ecg_new.csv": {
        "Subject",
        "SUBJID",
        "USUBJID",
        "Visit",
        "Folder",
        "FOLDER",
        "EGDTC",
        "DateTime",
        "QTcF Value",
        "QTcF",
        "QTcF Baseline Mean",
        "QTcF Change from Base",
        "QTcF Change from Baseline",
        "PR Interval",
        "QRS Duration",
        "Heart Rate",
    },
    "g360_filtered.csv": {
        "Subject",
        "SUBJID",
        "Visit",
        "VISIT",
        "Gene",
        "GENE",
        "p.HGVS",
        "pHGVS",
        "c.HGVS",
        "cHGVS",
        "AF",
        "Af",
        "Mutation Category",
        "Category",
        "ARM",
    },
}


def normalize_ref(name: str) -> str:
    return name.lower()


def load_headers() -> dict[str, set[str]]:
    headers: dict[str, set[str]] = {}
    for p in DATA_DIR.iterdir():
        if not p.is_file():
            continue
        key = normalize_ref(p.name)
        if p.suffix.lower() == ".json":
            headers[key] = set()
        elif p.suffix.lower() in {".csv", ".xlsx", ".sas7bdat"} or p.name.endswith(".CSV"):
            if p.suffix.lower() in {".xlsx", ".sas7bdat"}:
                headers[key] = set()
            else:
                with p.open() as f:
                    reader = csv.reader(f)
                    try:
                        headers[key] = set(next(reader))
                    except StopIteration:
                        headers[key] = set()
    return headers


def extract_refs() -> list[tuple[str, str]]:
    refs = []
    for p in ROOT.rglob("*"):
        if not p.is_file() or "mnt" in p.parts or p.suffix.lower() not in CODE_SUFFIXES:
            continue
        text = p.read_text(errors="ignore")
        for ref in sorted(set(re.findall(r"data/([A-Za-z0-9_.-]+)", text))):
            refs.append((str(p.relative_to(ROOT)), ref))
    return refs


def main() -> int:
    headers = load_headers()
    refs = extract_refs()

    missing_files = [(src, ref) for src, ref in refs if normalize_ref(ref) not in headers]
    missing_columns = []
    for file_name, required in CURATED_COLUMNS.items():
        actual = headers.get(file_name, set())
        missing = sorted(required - actual)
        if missing:
            missing_columns.append((file_name, missing))

    if missing_files:
        print("Missing referenced files:")
        for src, ref in missing_files:
            print(f"  {src}: {ref}")

    if missing_columns:
        print("Missing curated columns:")
        for file_name, cols in missing_columns:
            print(f"  {file_name}: {', '.join(cols)}")

    if missing_files or missing_columns:
        return 1

    print("Demo data validation passed.")
    print(f"Checked {len(refs)} code-to-data file references.")
    print(f"Validated curated columns for {len(CURATED_COLUMNS)} datasets.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
