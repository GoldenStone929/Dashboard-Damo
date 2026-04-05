/**
 * Shared Hardcoded Lab Data Configuration
 * File: hardcode.js
 * 
 * This file contains all hardcoded patient lab data that can be shared across
 * multiple lab-related pages (lab-original.html, lab-normalized.html, ctcae-labs.html, etc.)
 * 
 * Usage:
 *   1. Include this script in your HTML: <script src="../../assets/js/hardcode.js"></script>
 *   2. Access data via: LABS_HARDCODED_DATA.patients['patient-id']
 *   3. Use helper functions: LABS_HARDCODED_DATA.getPatientLabData(patientId, analyteName)
 * 
 * Patients included:
 *   - 16-103-1004: SAE Hepatic function abnormal G4
 *   - 14-102-1001: SAE G4 ALT, G3 AST/Bilirubin (DILI)
 *   - 22-101-1010: G3 transaminitis, G2 hyperbilirubinemia
 *   - 21-102-1001: G3 ALT, G2 AST
 *   - 22-101-1009: G3 AST/ALT, G2 BILI (sepsis)
 *   - 21-101-1003: SAE G3 Hyperbilirubinemia
 *   - 12-101-1001: G4 ALT, G3 AST (ICI-related hepatitis)
 *   - 10-113-1003: G3 ALT/AST (2 interruptions)
 *   - 16-102-1003: SAE G3 isolated hyperbilirubinemia
 *   - 16-102-1008: G3 ALT, G2 AST, G1 BILI
 *   - 16-101-1002: G3 ALT/AST, G2 BILI
 */

const LABS_HARDCODED_DATA = {
  
  // ==========================================================================
  // Hardcoded Lab Data by Patient
  // ==========================================================================
  patients: {
    
    // ========================================================================
    // Patient 16-103-1004
    // SAE: Hepatic function abnormal Grade 4
    // ========================================================================
    '16-103-1004': {
      info: {
        description: 'SAE: Hepatic function abnormal G4',
        dose: '80 mg QD',
        startDate: '18NOV2025',
        discontinuedDate: '08DEC2025'
      },
      ranges: {
        'Bilirubin; BILI': { low: 0.4, high: 1.5, units: 'mg/dL' },
        'Aspartate Aminotransferase; AST': { low: 13, high: 30, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: 7, high: 23, units: 'U/L' },
        'Alkaline Phosphatase; ALP': { low: 38, high: 113, units: 'U/L' }
      },
      data: [
        // Baseline / early labs
        { analyte: 'Bilirubin; BILI', date: '18NOV2025', value: 0.7 },
        { analyte: 'Bilirubin; BILI', date: '19NOV2025', value: 0.7 },
        { analyte: 'Bilirubin; BILI', date: '26NOV2025', value: 3.4 },
        { analyte: 'Bilirubin; BILI', date: '28NOV2025', value: 4.3 },
        { analyte: 'Bilirubin; BILI', date: '01DEC2025', value: 2.1 },
        { analyte: 'Bilirubin; BILI', date: '03DEC2025', value: 1.8 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '18NOV2025', value: 22 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '19NOV2025', value: 26 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '26NOV2025', value: 20 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '03DEC2025', value: 19 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '18NOV2025', value: 12 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '19NOV2025', value: 13 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '26NOV2025', value: 12 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '03DEC2025', value: 13 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '18NOV2025', value: 74 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '19NOV2025', value: 68 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '26NOV2025', value: 73 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '03DEC2025', value: 64 },
        // SAE onset and follow-up labs
        { analyte: 'Bilirubin; BILI', date: '08DEC2025', value: 5.0 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '08DEC2025', value: 1722 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '08DEC2025', value: 1314 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '08DEC2025', value: 93 },
        { analyte: 'Bilirubin; BILI', date: '09DEC2025', value: 6.5 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '09DEC2025', value: 1777 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '09DEC2025', value: 1038 },
        { analyte: 'Bilirubin; BILI', date: '10DEC2025', value: 6.5 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '10DEC2025', value: 1306 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '10DEC2025', value: 472 },
        { analyte: 'Bilirubin; BILI', date: '11DEC2025', value: 5.3 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '11DEC2025', value: 900 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '11DEC2025', value: 259 },
        { analyte: 'Bilirubin; BILI', date: '12DEC2025', value: 4.2 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '12DEC2025', value: 764 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '12DEC2025', value: 232 },
        { analyte: 'Bilirubin; BILI', date: '15DEC2025', value: 3.4 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '15DEC2025', value: 436 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '15DEC2025', value: 196 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '15DEC2025', value: 81 },
        { analyte: 'Bilirubin; BILI', date: '17DEC2025', value: 2.2 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '17DEC2025', value: 304 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '17DEC2025', value: 113 },
        { analyte: 'Bilirubin; BILI', date: '23DEC2025', value: 1.3 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '23DEC2025', value: 106 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '23DEC2025', value: 25 },
        { analyte: 'Bilirubin; BILI', date: '26DEC2025', value: 1.3 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '26DEC2025', value: 64 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '26DEC2025', value: 20 }
      ]
    },

    // ========================================================================
    // Patient 14-102-1001
    // SAE: Grade 4 ALT, Grade 3 AST/Bilirubin (DILI)
    // ========================================================================
    '14-102-1001': {
      info: {
        description: 'SAE: G4 ALT, G3 AST/Bilirubin (suspected DILI)',
        dose: '80 mg QD',
        startDate: '14OCT2025',
        discontinuedDate: '16DEC2025'
      },
      ranges: {
        'Albumin; ALB': { low: 3.5, high: 5.2, units: 'g/dL' },
        'Bilirubin; BILI': { low: null, high: 1.20, units: 'mg/dL' },
        'Aspartate Aminotransferase; AST': { low: 10, high: 35, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: 10, high: 35, units: 'U/L' },
        'Alkaline Phosphatase; ALP': { low: 35, high: 104, units: 'U/L' },
        'Prothrombin Intl. Normalized Ratio; INR': { low: 0.9, high: 1.1, units: 'RATIO' },
        'Direct Bilirubin; D-BIL': { low: null, high: 0.3, units: 'mg/dL' },
        'Indirect Bilirubin; I-BIL': { low: null, high: 0.9, units: 'mg/dL' }
      },
      data: [
        { analyte: 'Bilirubin; BILI', date: '28OCT2025', value: 1.51 },
        { analyte: 'Bilirubin; BILI', date: '04NOV2025', value: 1.0 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '25NOV2025', value: 37 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '25NOV2025', value: 26 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '25NOV2025', value: 90 },
        { analyte: 'Bilirubin; BILI', date: '25NOV2025', value: 0.64 },
        { analyte: 'Prothrombin Intl. Normalized Ratio; INR', date: '25NOV2025', value: 0.92 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '16DEC2025', value: 1017 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '16DEC2025', value: 650 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '16DEC2025', value: 160 },
        { analyte: 'Bilirubin; BILI', date: '16DEC2025', value: 6.40 },
        { analyte: 'Direct Bilirubin; D-BIL', date: '16DEC2025', value: 2.04 },
        { analyte: 'Prothrombin Intl. Normalized Ratio; INR', date: '16DEC2025', value: 1.16 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '17DEC2025', value: 851 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '17DEC2025', value: 604 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '17DEC2025', value: 130 },
        { analyte: 'Bilirubin; BILI', date: '17DEC2025', value: 5.62 },
        { analyte: 'Direct Bilirubin; D-BIL', date: '17DEC2025', value: 2.03 },
        { analyte: 'Indirect Bilirubin; I-BIL', date: '17DEC2025', value: 3.59 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '18DEC2025', value: 666 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '18DEC2025', value: 440 },
        { analyte: 'Bilirubin; BILI', date: '18DEC2025', value: 4.03 },
        { analyte: 'Prothrombin Intl. Normalized Ratio; INR', date: '18DEC2025', value: 1.11 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '19DEC2025', value: 577 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '19DEC2025', value: 362 },
        { analyte: 'Bilirubin; BILI', date: '19DEC2025', value: 2.95 },
        { analyte: 'Direct Bilirubin; D-BIL', date: '19DEC2025', value: 1.76 },
        { analyte: 'Indirect Bilirubin; I-BIL', date: '19DEC2025', value: 1.19 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '22DEC2025', value: 407 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '22DEC2025', value: 238 },
        { analyte: 'Bilirubin; BILI', date: '22DEC2025', value: 0.9 },
        { analyte: 'Direct Bilirubin; D-BIL', date: '22DEC2025', value: 0.72 },
        { analyte: 'Indirect Bilirubin; I-BIL', date: '22DEC2025', value: 0.19 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '30DEC2025', value: 183 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '30DEC2025', value: 106 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '30DEC2025', value: 158 },
        { analyte: 'Bilirubin; BILI', date: '30DEC2025', value: 0.65 },
        { analyte: 'Direct Bilirubin; D-BIL', date: '30DEC2025', value: 0.50 },
        { analyte: 'Indirect Bilirubin; I-BIL', date: '30DEC2025', value: 0.15 }
      ]
    },

    // ========================================================================
    // Patient 22-101-1010
    // 71-year-old male, advanced NSCLC, 40 mg BID
    // ========================================================================
    '22-101-1010': {
      info: {
        description: '71 y/o male, G3 transaminitis, G2 hyperbilirubinemia',
        dose: '40 mg BID',
        startDate: '10DEC2025'
      },
      ranges: {
        'Albumin; ALB': { low: 38, high: 50, units: 'g/L' },
        'Bilirubin; BILI': { low: 0, high: 1.23, units: 'mg/dL' },
        'Direct Bilirubin; D-BIL': { low: 0, high: 0.5, units: 'mg/dL' },
        'Indirect Bilirubin; I-BIL': { low: 0, high: 0.22, units: 'mg/dL' },
        'Aspartate Aminotransferase; AST': { low: 3, high: 40, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: 4, high: 41, units: 'U/L' },
        'Alkaline Phosphatase; ALP': { low: 40, high: 139, units: 'U/L' },
        'Prothrombin Intl. Normalized Ratio; INR': { low: 0.8, high: 1.2, units: 'RATIO' }
      },
      data: [
        { analyte: 'Bilirubin; BILI', date: '16DEC2025', value: 2.25 },
        { analyte: 'Bilirubin; BILI', date: '30DEC2025', value: 1.0 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '20JAN2026', value: 348 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '20JAN2026', value: 464 },
        { analyte: 'Bilirubin; BILI', date: '20JAN2026', value: 2.64 },
        { analyte: 'Direct Bilirubin; D-BIL', date: '20JAN2026', value: 1.12 },
        { analyte: 'Indirect Bilirubin; I-BIL', date: '20JAN2026', value: 1.52 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '20JAN2026', value: 137 },
        { analyte: 'Albumin; ALB', date: '20JAN2026', value: 42 },
        { analyte: 'Prothrombin Intl. Normalized Ratio; INR', date: '20JAN2026', value: 1.06 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '23JAN2026', value: 280 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '23JAN2026', value: 401 },
        { analyte: 'Bilirubin; BILI', date: '23JAN2026', value: 1.65 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '23JAN2026', value: 133 },
        { analyte: 'Albumin; ALB', date: '23JAN2026', value: 40.6 }
      ]
    },

    // ========================================================================
    // Patient 21-102-1001
    // 67-year-old Asian male, 40 mg BID (BILI in umol/L)
    // ========================================================================
    '21-102-1001': {
      info: {
        description: '67 y/o Asian male, G3 ALT, G2 AST',
        dose: '40 mg BID',
        startDate: '30SEP2025',
        note: 'BILI values in umol/L'
      },
      ranges: {
        'Bilirubin; BILI': { low: null, high: 32, units: 'umol/L' },
        'Aspartate Aminotransferase; AST': { low: null, high: 42, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: null, high: 66, units: 'U/L' }
      },
      data: [
        { analyte: 'Bilirubin; BILI', date: '08OCT2025', value: 35 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '08OCT2025', value: 24 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '08OCT2025', value: 22 },
        { analyte: 'Bilirubin; BILI', date: '15OCT2025', value: 21 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '15OCT2025', value: 23 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '15OCT2025', value: 22 },
        { analyte: 'Bilirubin; BILI', date: '12NOV2025', value: 24 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '12NOV2025', value: 343 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '12NOV2025', value: 194 }
      ]
    },

    // ========================================================================
    // Patient 22-101-1009
    // 63-year-old Asian female, pneumonia-induced sepsis
    // ========================================================================
    '22-101-1009': {
      info: {
        description: '63 y/o Asian female, G3 AST/ALT, G2 BILI (sepsis)',
        dose: '40 mg BID',
        startDate: '03DEC2025',
        note: 'BILI values in umol/L'
      },
      ranges: {
        'Bilirubin; BILI': { low: null, high: 32, units: 'umol/L' },
        'Aspartate Aminotransferase; AST': { low: null, high: 40, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: null, high: 40, units: 'U/L' },
        'Alkaline Phosphatase; ALP': { low: null, high: 104, units: 'U/L' },
        'Albumin; ALB': { low: 35, high: 50, units: 'g/L' }
      },
      data: [
        { analyte: 'Aspartate Aminotransferase; AST', date: '05JAN2026', value: 505 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '05JAN2026', value: 511 },
        { analyte: 'Bilirubin; BILI', date: '05JAN2026', value: 91.2 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '05JAN2026', value: 98 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '13JAN2026', value: 236 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '13JAN2026', value: 243 },
        { analyte: 'Bilirubin; BILI', date: '13JAN2026', value: 23 },
        { analyte: 'Albumin; ALB', date: '13JAN2026', value: 23 }
      ]
    },

    // ========================================================================
    // Patient 21-101-1003
    // 62-year-old Asian female, SAE: G3 Hyperbilirubinemia
    // ========================================================================
    '21-101-1003': {
      info: {
        description: '62 y/o Asian female, SAE: G3 Hyperbilirubinemia (suspected DILI)',
        dose: '40 mg BID',
        startDate: '25NOV2025',
        note: 'BILI values in umol/L'
      },
      ranges: {
        'Bilirubin; BILI': { low: 1, high: 20, units: 'umol/L' },
        'Aspartate Aminotransferase; AST': { low: 6, high: 30, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: 6, high: 35, units: 'U/L' },
        'Alkaline Phosphatase; ALP': { low: 40, high: 130, units: 'U/L' },
        'Albumin; ALB': { low: 35, high: 50, units: 'g/L' }
      },
      data: [
        { analyte: 'Bilirubin; BILI', date: '05DEC2025', value: 34 },
        { analyte: 'Bilirubin; BILI', date: '19JAN2026', value: 83 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '19JAN2026', value: 411 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '19JAN2026', value: 353 },
        { analyte: 'Bilirubin; BILI', date: '22JAN2026', value: 20 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '22JAN2026', value: 269 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '22JAN2026', value: 273 }
      ]
    },

    // ========================================================================
    // Patient 12-101-1001
    // 72-year-old White female, G4 ALT, G3 AST (ICI-related hepatitis)
    // ========================================================================
    '12-101-1001': {
      info: {
        description: '72 y/o White female, G4 ALT, G3 AST (ICI-related hepatitis)',
        dose: '40 mg BID',
        startDate: '11SEP2025',
        note: 'BILI values in umol/L'
      },
      ranges: {
        'Bilirubin; BILI': { low: null, high: 21, units: 'umol/L' },
        'Aspartate Aminotransferase; AST': { low: null, high: 31, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: null, high: 35, units: 'U/L' }
      },
      data: [
        { analyte: 'Alanine Aminotransferase; ALT', date: '22OCT2025', value: 868 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '22OCT2025', value: 637 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '27OCT2025', value: 641 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '27OCT2025', value: 333 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '06NOV2025', value: 130 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '06NOV2025', value: 72 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '10NOV2025', value: 66 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '10NOV2025', value: 36 },
        { analyte: 'Bilirubin; BILI', date: '24NOV2025', value: 27 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '24NOV2025', value: 36 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '24NOV2025', value: 28 }
      ]
    },

    // ========================================================================
    // Patient 10-113-1003
    // 26-year-old male, G3 ALT/AST (2 interruptions, 2 re-challenges)
    // ========================================================================
    '10-113-1003': {
      info: {
        description: '26 y/o male, G3 ALT/AST (2 interruptions, 2 re-challenges)',
        dose: '40 mg BID',
        startDate: '04SEP2025'
      },
      ranges: {
        'Bilirubin; BILI': { low: null, high: 1.2, units: 'mg/dL' },
        'Aspartate Aminotransferase; AST': { low: null, high: 48, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: null, high: 55, units: 'U/L' }
      },
      data: [
        { analyte: 'Bilirubin; BILI', date: '25SEP2025', value: 0.7 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '25SEP2025', value: 78 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '25SEP2025', value: 40 },
        { analyte: 'Bilirubin; BILI', date: '13OCT2025', value: 0.8 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '13OCT2025', value: 458 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '13OCT2025', value: 174 },
        { analyte: 'Bilirubin; BILI', date: '17OCT2025', value: 0.5 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '17OCT2025', value: 494 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '17OCT2025', value: 145 },
        { analyte: 'Bilirubin; BILI', date: '23OCT2025', value: 0.4 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '23OCT2025', value: 195 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '23OCT2025', value: 47 },
        { analyte: 'Bilirubin; BILI', date: '29OCT2025', value: 1.1 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '29OCT2025', value: 194 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '29OCT2025', value: 75 },
        { analyte: 'Bilirubin; BILI', date: '10NOV2025', value: 0.5 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '10NOV2025', value: 109 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '10NOV2025', value: 40 }
      ]
    },

    // ========================================================================
    // Patient 16-102-1003
    // 54-year-old Asian female, SAE: G3 isolated hyperbilirubinemia
    // ========================================================================
    '16-102-1003': {
      info: {
        description: '54 y/o Asian female, SAE: G3 isolated hyperbilirubinemia',
        dose: '80 mg BID → 40 mg BID',
        startDate: '21MAY2025',
        interruptedDate: '25MAY2025',
        resumedDate: '02JUL2025'
      },
      ranges: {
        'Bilirubin; BILI': { low: 0.4, high: 1.5, units: 'mg/dL' },
        'Aspartate Aminotransferase; AST': { low: 13, high: 30, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: 7, high: 23, units: 'U/L' },
        'Alkaline Phosphatase; ALP': { low: 38, high: 113, units: 'U/L' },
        'Albumin; ALB': { low: 4.1, high: 5.1, units: 'g/dL' }
      },
      data: [
        { analyte: 'Bilirubin; BILI', date: '26MAY2025', value: 8.4 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '26MAY2025', value: 75 },
        { analyte: 'Albumin; ALB', date: '26MAY2025', value: 3.8 },
        { analyte: 'Bilirubin; BILI', date: '27MAY2025', value: 7.5 },
        { analyte: 'Albumin; ALB', date: '27MAY2025', value: 3.4 },
        { analyte: 'Bilirubin; BILI', date: '28MAY2025', value: 3.8 },
        { analyte: 'Albumin; ALB', date: '28MAY2025', value: 3.7 },
        { analyte: 'Bilirubin; BILI', date: '29MAY2025', value: 1.6 },
        { analyte: 'Albumin; ALB', date: '29MAY2025', value: 3.6 },
        { analyte: 'Bilirubin; BILI', date: '02JUN2025', value: 0.3 },
        { analyte: 'Albumin; ALB', date: '02JUN2025', value: 3.3 },
        { analyte: 'Bilirubin; BILI', date: '04JUN2025', value: 0.3 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '04JUN2025', value: 53 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '04JUN2025', value: 50 },
        { analyte: 'Albumin; ALB', date: '04JUN2025', value: 3.6 }
      ]
    },

    // ========================================================================
    // Patient 16-102-1008
    // 74-year-old Asian male, G3 ALT, G2 AST, G1 Bilirubin
    // ========================================================================
    '16-102-1008': {
      info: {
        description: '74 y/o Asian male, non-serious G3 ALT, G2 AST, G1 BILI',
        dose: '40 mg BID',
        startDate: '26NOV2025',
        interruptedDate: '09JAN2026'
      },
      ranges: {
        'Bilirubin; BILI': { low: 0.4, high: 1.5, units: 'mg/dL' },
        'Aspartate Aminotransferase; AST': { low: 13, high: 30, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: 10, high: 42, units: 'U/L' },
        'Alkaline Phosphatase; ALP': { low: 35, high: 104, units: 'U/L' }
      },
      data: [
        { analyte: 'Alanine Aminotransferase; ALT', date: '26NOV2025', value: 20 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '26NOV2025', value: 22 },
        { analyte: 'Bilirubin; BILI', date: '26NOV2025', value: 0.8 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '26NOV2025', value: 70 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '09JAN2026', value: 220 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '09JAN2026', value: 100 },
        { analyte: 'Bilirubin; BILI', date: '09JAN2026', value: 2.0 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '16JAN2026', value: 170 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '16JAN2026', value: 85 },
        { analyte: 'Bilirubin; BILI', date: '16JAN2026', value: 0.7 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '23JAN2026', value: 71 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '23JAN2026', value: 38 },
        { analyte: 'Bilirubin; BILI', date: '23JAN2026', value: 0.4 }
      ]
    },

    // ========================================================================
    // Patient 16-101-1002
    // 61-year-old Asian female, G3 ALT/AST, G2 Bilirubin
    // ========================================================================
    '16-101-1002': {
      info: {
        description: '61 y/o Asian female, G3 ALT/AST, G2 BILI',
        dose: '40 mg BID → 20 mg BID',
        startDate: '10SEP2025',
        interruptedDate: '12NOV2025',
        resumedDate: '26NOV2025'
      },
      ranges: {
        'Bilirubin; BILI': { low: null, high: 1.5, units: 'mg/dL' },
        'Aspartate Aminotransferase; AST': { low: null, high: 30, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: null, high: 23, units: 'U/L' },
        'Alkaline Phosphatase; ALP': { low: null, high: 113, units: 'U/L' }
      },
      data: [
        { analyte: 'Bilirubin; BILI', date: '12NOV2025', value: 2.8 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '12NOV2025', value: 126 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '12NOV2025', value: 125 },
        { analyte: 'Bilirubin; BILI', date: '19NOV2025', value: 0.5 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '19NOV2025', value: 68 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '19NOV2025', value: 78 },
        { analyte: 'Bilirubin; BILI', date: '26NOV2025', value: 0.4 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '26NOV2025', value: 41 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '26NOV2025', value: 62 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '26NOV2025', value: 128 }
      ]
    }
  },

  // ==========================================================================
  // Helper Functions
  // ==========================================================================

  /**
   * Parse date string (DDMMMYYYY format) to Date object
   */
  parseDate: function(dateStr) {
    if (!dateStr) return null;
    const months = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
                     JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
    const match = String(dateStr).match(/^(\d{1,2})([A-Z]{3})(\d{4})/i);
    if (match) {
      const day = parseInt(match[1]);
      const month = months[match[2].toUpperCase()];
      const year = parseInt(match[3]);
      if (month !== undefined) {
        return new Date(year, month, day);
      }
    }
    return null;
  },

  /**
   * Format date to RecordDate format (DDMMMYYYY:00:00:00.000)
   */
  formatRecordDate: function(dateStr) {
    return dateStr + ':00:00:00.000';
  },

  /**
   * Get all patient IDs with hardcoded data
   */
  getPatientIds: function() {
    return Object.keys(this.patients);
  },

  /**
   * Get all unique analyte names across all patients
   */
  getAllAnalytes: function() {
    const analytes = new Set();
    Object.values(this.patients).forEach(patient => {
      Object.keys(patient.ranges).forEach(analyte => analytes.add(analyte));
    });
    return Array.from(analytes).sort();
  },

  /**
   * Check if a patient has hardcoded data
   */
  hasPatient: function(patientId) {
    return this.patients.hasOwnProperty(patientId);
  },

  /**
   * Get patient info
   */
  getPatientInfo: function(patientId) {
    return this.patients[patientId]?.info || null;
  },

  /**
   * Get lab ranges for a patient and analyte
   */
  getRanges: function(patientId, analyteName) {
    return this.patients[patientId]?.ranges?.[analyteName] || null;
  },

  /**
   * Get all lab data for a patient
   */
  getPatientData: function(patientId) {
    return this.patients[patientId]?.data || [];
  },

  /**
   * Get lab data for a patient filtered by analyte
   */
  getPatientLabData: function(patientId, analyteName) {
    const patient = this.patients[patientId];
    if (!patient) return [];
    return patient.data.filter(d => d.analyte === analyteName);
  },

  /**
   * Get all lab data for a specific analyte across all patients
   */
  getAnalyteData: function(analyteName) {
    const results = [];
    Object.entries(this.patients).forEach(([patientId, patient]) => {
      const ranges = patient.ranges[analyteName];
      if (!ranges) return;
      
      patient.data
        .filter(d => d.analyte === analyteName)
        .forEach(d => {
          results.push({
            Subject: patientId,
            AnalyteName: analyteName,
            RecordDate: this.formatRecordDate(d.date),
            DateObj: this.parseDate(d.date),
            NumericValue: d.value,
            Value: d.value,
            LabLow: ranges.low,
            LabHigh: ranges.high,
            LabUnits: ranges.units,
            Low: ranges.low,
            High: ranges.high,
            Units: ranges.units,
            IsHardcoded: true
          });
        });
    });
    return results;
  },

  /**
   * Merge hardcoded data with CSV data
   * Hardcoded data takes priority over CSV data for same Subject + Date + Analyte
   */
  mergeWithCSVData: function(csvLabData, analyteName = null) {
    // Get hardcoded data
    let hardcodedData;
    if (analyteName) {
      hardcodedData = this.getAnalyteData(analyteName);
    } else {
      hardcodedData = [];
      this.getAllAnalytes().forEach(analyte => {
        hardcodedData = hardcodedData.concat(this.getAnalyteData(analyte));
      });
    }

    if (hardcodedData.length === 0) {
      return csvLabData;
    }

    // Create a set of keys for hardcoded data
    const hardcodedKeys = new Set();
    hardcodedData.forEach(row => {
      const dateStr = row.RecordDate.split(':')[0];
      const key = `${row.Subject}|${row.AnalyteName}|${dateStr}`;
      hardcodedKeys.add(key);
    });

    // Filter out CSV data that conflicts with hardcoded data
    const filteredCSV = csvLabData.filter(row => {
      const dateStr = (row.RecordDate || '').split(':')[0];
      const key = `${row.Subject}|${row.AnalyteName}|${dateStr}`;
      return !hardcodedKeys.has(key);
    });

    // Merge
    return [...filteredCSV, ...hardcodedData];
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.LABS_HARDCODED_DATA = LABS_HARDCODED_DATA;
}
