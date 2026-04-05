/**
 * Labs Page Configuration
 * 
 * This file contains hardcoded configuration for the Labs Analysis Dashboard.
 * Hardcoded patient data is displayed with TRIANGLE markers on the chart.
 * 
 * NOTE: Hardcoded patient data is now shared via hardcode.js
 * This config references that shared data for backward compatibility.
 */

const LABS_CONFIG = {
  
  // ==========================================================================
  // Hardcoded Lab Data by Patient (Reference to shared data)
  // Uses LABS_HARDCODED_DATA if available, otherwise uses inline data
  // ==========================================================================
  get hardcodedPatients() {
    // Use shared data if available
    if (typeof LABS_HARDCODED_DATA !== 'undefined') {
      return LABS_HARDCODED_DATA.patients;
    }
    // Fallback to inline data
    return this._inlineHardcodedPatients;
  },
  
  _inlineHardcodedPatients: {
    
    // ========================================================================
    // Patient 16-103-1004
    // ========================================================================
    '16-103-1004': {
      ranges: {
        // Reference ranges from narrative
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
        { analyte: 'Bilirubin; BILI', date: '09DEC2025', value: 5.9 },
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
    // ========================================================================
    '14-102-1001': {
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
        // 28-Oct-2025: T-bil elevated to 1.51
        { analyte: 'Bilirubin; BILI', date: '28OCT2025', value: 1.51 },
        // 04-Nov-2025: T-bil returned to normal
        { analyte: 'Bilirubin; BILI', date: '04NOV2025', value: 1.0 },
        // 25-Nov-2025: LFTs mostly normal
        { analyte: 'Aspartate Aminotransferase; AST', date: '25NOV2025', value: 37 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '25NOV2025', value: 26 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '25NOV2025', value: 90 },
        { analyte: 'Bilirubin; BILI', date: '25NOV2025', value: 0.64 },
        { analyte: 'Prothrombin Intl. Normalized Ratio; INR', date: '25NOV2025', value: 0.92 },
        // 16-Dec-2025: Severe LFT elevation
        { analyte: 'Alanine Aminotransferase; ALT', date: '16DEC2025', value: 1017 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '16DEC2025', value: 650 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '16DEC2025', value: 160 },
        { analyte: 'Bilirubin; BILI', date: '16DEC2025', value: 6.40 },
        { analyte: 'Direct Bilirubin; D-BIL', date: '16DEC2025', value: 2.04 },
        { analyte: 'Prothrombin Intl. Normalized Ratio; INR', date: '16DEC2025', value: 1.16 },
        // 17-Dec-2025: LFTs improving
        { analyte: 'Alanine Aminotransferase; ALT', date: '17DEC2025', value: 851 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '17DEC2025', value: 604 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '17DEC2025', value: 130 },
        { analyte: 'Bilirubin; BILI', date: '17DEC2025', value: 5.62 },
        { analyte: 'Direct Bilirubin; D-BIL', date: '17DEC2025', value: 2.03 },
        { analyte: 'Indirect Bilirubin; I-BIL', date: '17DEC2025', value: 3.59 },
        // 18-Dec-2025: Further improvement
        { analyte: 'Alanine Aminotransferase; ALT', date: '18DEC2025', value: 666 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '18DEC2025', value: 440 },
        { analyte: 'Bilirubin; BILI', date: '18DEC2025', value: 4.03 },
        { analyte: 'Prothrombin Intl. Normalized Ratio; INR', date: '18DEC2025', value: 1.11 },
        // 19-Dec-2025: Continued improvement
        { analyte: 'Alanine Aminotransferase; ALT', date: '19DEC2025', value: 577 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '19DEC2025', value: 362 },
        { analyte: 'Bilirubin; BILI', date: '19DEC2025', value: 2.95 },
        { analyte: 'Direct Bilirubin; D-BIL', date: '19DEC2025', value: 1.76 },
        { analyte: 'Indirect Bilirubin; I-BIL', date: '19DEC2025', value: 1.19 },
        // 22-Dec-2025: Bilirubin normalized, ALT/AST still elevated
        { analyte: 'Alanine Aminotransferase; ALT', date: '22DEC2025', value: 407 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '22DEC2025', value: 238 },
        { analyte: 'Bilirubin; BILI', date: '22DEC2025', value: 0.9 },
        { analyte: 'Direct Bilirubin; D-BIL', date: '22DEC2025', value: 0.72 },
        { analyte: 'Indirect Bilirubin; I-BIL', date: '22DEC2025', value: 0.19 },
        // 30-Dec-2025: Follow-up - continued improvement
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
    // 71-year-old male, advanced NSCLC, 40 mg BID started 10-Dec-2025
    // ========================================================================
    '22-101-1010': {
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
        // 16-Dec-2025: Grade 2 hyperbilirubinemia
        { analyte: 'Bilirubin; BILI', date: '16DEC2025', value: 2.25 },
        // 30-Dec-2025: Bilirubin resolved to normal
        { analyte: 'Bilirubin; BILI', date: '30DEC2025', value: 1.0 },

        // 20-Jan-2026 (C2D20): Grade 3 transaminitis with Grade 2 bilirubin, mixed hyperbilirubinemia
        { analyte: 'Aspartate Aminotransferase; AST', date: '20JAN2026', value: 348 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '20JAN2026', value: 464 },
        { analyte: 'Bilirubin; BILI', date: '20JAN2026', value: 2.64 },
        { analyte: 'Direct Bilirubin; D-BIL', date: '20JAN2026', value: 1.12 },
        { analyte: 'Indirect Bilirubin; I-BIL', date: '20JAN2026', value: 1.52 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '20JAN2026', value: 137 },
        { analyte: 'Albumin; ALB', date: '20JAN2026', value: 42 },
        { analyte: 'Prothrombin Intl. Normalized Ratio; INR', date: '20JAN2026', value: 1.06 },

        // 23-Jan-2026: Follow-up labs - improving (bili 28.3 umol/L = 1.65 mg/dL)
        { analyte: 'Aspartate Aminotransferase; AST', date: '23JAN2026', value: 280 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '23JAN2026', value: 401 },
        { analyte: 'Bilirubin; BILI', date: '23JAN2026', value: 1.65 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '23JAN2026', value: 133 },
        { analyte: 'Albumin; ALB', date: '23JAN2026', value: 40.6 }
      ]
    },

    // ========================================================================
    // Patient 21-102-1001
    // 67-year-old Asian male, 40 mg BID started 30-Sep-2025
    // Note: BILI values in umol/L
    // ========================================================================
    '21-102-1001': {
      ranges: {
        'Bilirubin; BILI': { low: null, high: 32, units: 'umol/L' },
        'Aspartate Aminotransferase; AST': { low: null, high: 42, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: null, high: 66, units: 'U/L' }
      },
      data: [
        // 8-Oct-2025: Normal values
        { analyte: 'Bilirubin; BILI', date: '08OCT2025', value: 35 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '08OCT2025', value: 24 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '08OCT2025', value: 22 },
        // 15-Oct-2025: Normal values
        { analyte: 'Bilirubin; BILI', date: '15OCT2025', value: 21 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '15OCT2025', value: 23 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '15OCT2025', value: 22 },
        // 12-Nov-2025: Grade 3 ALT elevation, Grade 2 AST elevation
        { analyte: 'Bilirubin; BILI', date: '12NOV2025', value: 24 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '12NOV2025', value: 343 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '12NOV2025', value: 194 }
      ]
    },

    // ========================================================================
    // Patient 22-101-1009
    // 63-year-old Asian female, 40 mg BID started 3-Dec-2025
    // G3 AST/ALT, G2 BILI due to pneumonia-induced sepsis with liver derangement
    // Clinical course: Fever and LFT abnormalities in early Jan 2026, sepsis from
    // chest infection, transient hepatocellular derangement. Improved by 14-Jan-2026.
    // Note: BILI values in umol/L
    // ========================================================================
    '22-101-1009': {
      ranges: {
        'Bilirubin; BILI': { low: null, high: 32, units: 'umol/L' },
        'Aspartate Aminotransferase; AST': { low: null, high: 40, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: null, high: 40, units: 'U/L' },
        'Alkaline Phosphatase; ALP': { low: null, high: 104, units: 'U/L' },
        'Albumin; ALB': { low: 35, high: 50, units: 'g/L' }
      },
      data: [
        // 5-Jan-2026: Grade 3 AST/ALT (505/511), Grade 2 BILI (91.2 umol/L), normal ALP
        { analyte: 'Aspartate Aminotransferase; AST', date: '05JAN2026', value: 505 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '05JAN2026', value: 511 },
        { analyte: 'Bilirubin; BILI', date: '05JAN2026', value: 91.2 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '05JAN2026', value: 98 },
        // 13-Jan-2026: Improving - BILI 23, AST 236, ALT 243, ALB 23 g/L (low due to acute phase)
        { analyte: 'Aspartate Aminotransferase; AST', date: '13JAN2026', value: 236 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '13JAN2026', value: 243 },
        { analyte: 'Bilirubin; BILI', date: '13JAN2026', value: 23 },
        { analyte: 'Albumin; ALB', date: '13JAN2026', value: 23 }
      ]
    },

    // ========================================================================
    // Patient 21-101-1003
    // 62-year-old Asian female from Singapore, 40 mg BID started 25-Nov-2025
    // SAE: Grade 3 Hyperbilirubinemia with AST/ALT elevation (suspected DILI)
    // Clinical course: Mild bilirubin elevation early, G3 on 19-Jan-2026,
    // improved and discharged 22-Jan-2026. Viral workup negative.
    // Note: BILI values in umol/L
    // ========================================================================
    '21-101-1003': {
      ranges: {
        'Bilirubin; BILI': { low: 1, high: 20, units: 'umol/L' },
        'Aspartate Aminotransferase; AST': { low: 6, high: 30, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: 6, high: 35, units: 'U/L' },
        'Alkaline Phosphatase; ALP': { low: 40, high: 130, units: 'U/L' },
        'Albumin; ALB': { low: 35, high: 50, units: 'g/L' }
      },
      data: [
        // Early treatment (~05-Dec-2025): Mild bilirubin elevation
        { analyte: 'Bilirubin; BILI', date: '05DEC2025', value: 34 },
        // 19-Jan-2026: Grade 3 hyperbilirubinemia, elevated AST/ALT
        { analyte: 'Bilirubin; BILI', date: '19JAN2026', value: 83 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '19JAN2026', value: 411 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '19JAN2026', value: 353 },
        // 22-Jan-2026: Improved - BILI back to normal, AST/ALT still elevated but improving
        { analyte: 'Bilirubin; BILI', date: '22JAN2026', value: 20 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '22JAN2026', value: 269 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '22JAN2026', value: 273 }
      ]
    },

    // ========================================================================
    // Patient 12-101-1001
    // 72-year-old White female from Australia, 40 mg BID started 11-Sep-2025
    // Non-serious G4 ALT, G3 AST (related), no bilirubin elevation
    // Biopsy showed ICI-related hepatitis; improved with steroids
    // Note: BILI values in umol/L, ALT/AST in U/L
    // ========================================================================
    '12-101-1001': {
      ranges: {
        'Bilirubin; BILI': { low: null, high: 21, units: 'umol/L' },
        'Aspartate Aminotransferase; AST': { low: null, high: 31, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: null, high: 35, units: 'U/L' }
      },
      data: [
        // 22-Oct-2025: G4 ALT (~25×ULN), G3 AST - dose interrupted
        { analyte: 'Alanine Aminotransferase; ALT', date: '22OCT2025', value: 868 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '22OCT2025', value: 637 },
        // 27-Oct-2025: Improving on steroids
        { analyte: 'Alanine Aminotransferase; ALT', date: '27OCT2025', value: 641 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '27OCT2025', value: 333 },
        // 06-Nov-2025: Further improvement
        { analyte: 'Alanine Aminotransferase; ALT', date: '06NOV2025', value: 130 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '06NOV2025', value: 72 },
        // 10-Nov-2025: Near normal - dose restarted
        { analyte: 'Alanine Aminotransferase; ALT', date: '10NOV2025', value: 66 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '10NOV2025', value: 36 },
        // 24-Nov-2025: Stable on rechallenge
        { analyte: 'Bilirubin; BILI', date: '24NOV2025', value: 27 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '24NOV2025', value: 36 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '24NOV2025', value: 28 }
      ]
    },

    // ========================================================================
    // Patient 10-113-1003
    // 26-year-old male from USA, 40 mg BID started 04-Sep-2025
    // Non-serious G3 ALT/AST elevations (related), bilirubin normal
    // 2 interruptions (G3 transaminase, G3 rash) and 2 re-challenges
    // Note: BILI values in mg/dL
    // ========================================================================
    '10-113-1003': {
      ranges: {
        'Bilirubin; BILI': { low: null, high: 1.2, units: 'mg/dL' },
        'Aspartate Aminotransferase; AST': { low: null, high: 48, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: null, high: 55, units: 'U/L' }
      },
      data: [
        // 25-Sep-2025 (Day 21): Mild elevations
        { analyte: 'Bilirubin; BILI', date: '25SEP2025', value: 0.7 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '25SEP2025', value: 78 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '25SEP2025', value: 40 },
        // 13-Oct-2025: G3 transaminase - dose interrupted
        { analyte: 'Bilirubin; BILI', date: '13OCT2025', value: 0.8 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '13OCT2025', value: 458 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '13OCT2025', value: 174 },
        // 17-Oct-2025: Follow-up
        { analyte: 'Bilirubin; BILI', date: '17OCT2025', value: 0.5 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '17OCT2025', value: 494 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '17OCT2025', value: 145 },
        // 23-Oct-2025: Improving - dose resumed
        { analyte: 'Bilirubin; BILI', date: '23OCT2025', value: 0.4 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '23OCT2025', value: 195 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '23OCT2025', value: 47 },
        // 29-Oct-2025: Further improvement
        { analyte: 'Bilirubin; BILI', date: '29OCT2025', value: 1.1 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '29OCT2025', value: 194 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '29OCT2025', value: 75 },
        // 10-Nov-2025: After second interruption (rash) - re-challenged
        { analyte: 'Bilirubin; BILI', date: '10NOV2025', value: 0.5 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '10NOV2025', value: 109 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '10NOV2025', value: 40 }
      ]
    },

    // ========================================================================
    // Patient 16-102-1003
    // 54-year-old Asian female from Japan, 80 mg BID started 21-May-2025
    // SAE: Grade 3 isolated hyperbilirubinemia (no AST/ALT elevation initially)
    // Drug interrupted 25-May-2025, resumed 02-Jul-2025 at 40 mg BID
    // Note: BILI values in mg/dL
    // ========================================================================
    '16-102-1003': {
      ranges: {
        'Bilirubin; BILI': { low: 0.4, high: 1.5, units: 'mg/dL' },
        'Aspartate Aminotransferase; AST': { low: 13, high: 30, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: 7, high: 23, units: 'U/L' },
        'Alkaline Phosphatase; ALP': { low: 38, high: 113, units: 'U/L' },
        'Albumin; ALB': { low: 4.1, high: 5.1, units: 'g/dL' }
      },
      data: [
        // 26-May-2025: SAE onset - G3 bilirubin (8.4), normal AST/ALT
        { analyte: 'Bilirubin; BILI', date: '26MAY2025', value: 8.4 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '26MAY2025', value: 75 },
        { analyte: 'Albumin; ALB', date: '26MAY2025', value: 3.8 },
        // 27-May-2025: Bilirubin improving
        { analyte: 'Bilirubin; BILI', date: '27MAY2025', value: 7.5 },
        { analyte: 'Albumin; ALB', date: '27MAY2025', value: 3.4 },
        // 28-May-2025: Bilirubin G2
        { analyte: 'Bilirubin; BILI', date: '28MAY2025', value: 3.8 },
        { analyte: 'Albumin; ALB', date: '28MAY2025', value: 3.7 },
        // 29-May-2025: Bilirubin G1
        { analyte: 'Bilirubin; BILI', date: '29MAY2025', value: 1.6 },
        { analyte: 'Albumin; ALB', date: '29MAY2025', value: 3.6 },
        // 02-Jun-2025: Bilirubin normal
        { analyte: 'Bilirubin; BILI', date: '02JUN2025', value: 0.3 },
        { analyte: 'Albumin; ALB', date: '02JUN2025', value: 3.3 },
        // 04-Jun-2025: Mild AST/ALT elevation (possibly viral)
        { analyte: 'Bilirubin; BILI', date: '04JUN2025', value: 0.3 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '04JUN2025', value: 53 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '04JUN2025', value: 50 },
        { analyte: 'Albumin; ALB', date: '04JUN2025', value: 3.6 }
      ]
    },

    // ========================================================================
    // Patient 16-102-1008
    // 74-year-old Asian male from Japan, 40 mg BID started 26-Nov-2025
    // Non-serious G3 ALT, G2 AST, G1 Bilirubin (related)
    // Interrupted 09-Jan-2026, improving after dose interruption
    // ========================================================================
    '16-102-1008': {
      ranges: {
        'Bilirubin; BILI': { low: 0.4, high: 1.5, units: 'mg/dL' },
        'Aspartate Aminotransferase; AST': { low: 13, high: 30, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: 10, high: 42, units: 'U/L' }
      },
      data: [
        // 09-Jan-2026 (C3D1): G3 ALT, G2 AST, G1 Bili - dose interrupted
        { analyte: 'Alanine Aminotransferase; ALT', date: '09JAN2026', value: 220 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '09JAN2026', value: 100 },
        { analyte: 'Bilirubin; BILI', date: '09JAN2026', value: 2.0 },
        // 16-Jan-2026: Improving - Bili normal, ALT G2, AST G1
        { analyte: 'Alanine Aminotransferase; ALT', date: '16JAN2026', value: 170 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '16JAN2026', value: 85 },
        { analyte: 'Bilirubin; BILI', date: '16JAN2026', value: 0.7 },
        // 23-Jan-2026 (C3D15): ALT G1, AST and Bili normal
        { analyte: 'Alanine Aminotransferase; ALT', date: '23JAN2026', value: 71 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '23JAN2026', value: 38 },
        { analyte: 'Bilirubin; BILI', date: '23JAN2026', value: 0.4 }
      ]
    },

    // ========================================================================
    // Patient 16-101-1002
    // 61-year-old Asian female from Japan, 40 mg BID started 10-Sep-2025
    // Non-serious G3 ALT/AST, G2 Bilirubin (related)
    // Interrupted 12-Nov-2025, rechallenge 26-Nov-2025 at 20 mg BID
    // Note: Site local lab ULN - BILI: 1.5, ALT: 23, AST: 30
    // ========================================================================
    '16-101-1002': {
      ranges: {
        'Bilirubin; BILI': { low: null, high: 1.5, units: 'mg/dL' },
        'Aspartate Aminotransferase; AST': { low: null, high: 30, units: 'U/L' },
        'Alanine Aminotransferase; ALT': { low: null, high: 23, units: 'U/L' }
      },
      data: [
        // C4D1 (12-Nov-2025): G3 ALT/AST, G2 Bili - drug interrupted
        { analyte: 'Bilirubin; BILI', date: '12NOV2025', value: 2.8 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '12NOV2025', value: 126 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '12NOV2025', value: 125 },
        // 19-Nov-2025: Unscheduled - improving
        { analyte: 'Bilirubin; BILI', date: '19NOV2025', value: 0.5 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '19NOV2025', value: 68 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '19NOV2025', value: 78 },
        // 26-Nov-2025: Rechallenge at 20 mg BID
        { analyte: 'Bilirubin; BILI', date: '26NOV2025', value: 0.4 },
        { analyte: 'Alanine Aminotransferase; ALT', date: '26NOV2025', value: 41 },
        { analyte: 'Aspartate Aminotransferase; AST', date: '26NOV2025', value: 62 },
        { analyte: 'Alkaline Phosphatase; ALP', date: '26NOV2025', value: 128 }
      ]
    }
  },

  // ==========================================================================
  // Display settings
  // ==========================================================================
  display: {
    chartHeight: 750,
    pointRadius: 6,
    
    // Point styles
    pointStyles: {
      standard: 'circle',    // Standard (SI Units)
      localLab: 'rect',      // Local Lab Units (square)
      hardcoded: 'triangle'  // Hardcoded/manual data
    },
    
    // xULN thresholds for color coding
    xULN: {
      warning: 3,
      critical: 5
    }
  },

  // ==========================================================================
  // Analytes to exclude from display
  // ==========================================================================
  excludedAnalytes: [],

  // ==========================================================================
  // Visit/Folder name mappings
  // ==========================================================================
  visitMappings: {
    'DSET': 'End of treatment',
    'SCRN': 'Screening',
    'C0D1': 'Cycle 0 Day 1'
  }
};

// Helper function to parse date string (DDMMMYYYY format)
LABS_CONFIG.parseHardcodedDate = function(dateStr) {
  const months = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
                   JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
  const match = dateStr.match(/^(\d{2})([A-Z]{3})(\d{4})/i);
  if (match) {
    const day = parseInt(match[1]);
    const month = months[match[2].toUpperCase()];
    const year = parseInt(match[3]);
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }
  return null;
};

/**
 * Get hardcoded data for a specific analyte with pre-calculated normalization
 * 
 * Normalization formula: (Value - LLN) / (ULN - LLN)
 * - Requires LLN and ULN to be present (no defaults)
 * - If LLN/ULN missing or ULN <= LLN, the record is skipped
 * 
 * @param {string} analyteName - The analyte name to filter
 * @param {Object} baselineDates - Map of Subject -> baseline Date for StudyDay calculation
 * @param {Object} armLookup - Map of Subject -> ARM for dosing group
 * @returns {Array} Array of pre-processed records ready for chart display
 */
LABS_CONFIG.getHardcodedDataForAnalyte = function(analyteName, baselineDates = {}, armLookup = {}) {
  const results = [];
  
  Object.entries(this.hardcodedPatients).forEach(([patientId, patientData]) => {
    const ranges = patientData.ranges[analyteName];
    if (!ranges) return; // No range defined for this analyte for this patient
    
    // Require complete hardcoded range (Low, High, Units) - no defaults
    const hasLow = ranges.low !== null && ranges.low !== undefined && isFinite(ranges.low);
    const hasHigh = ranges.high !== null && ranges.high !== undefined && isFinite(ranges.high) && ranges.high > 0;
    const hasUnits = typeof ranges.units === 'string' && ranges.units.trim() !== '';
    
    if (!hasLow || !hasHigh || !hasUnits) {
      // Incomplete hardcoded range - skip these datapoints
      return;
    }
    
    const lln = ranges.low;
    const uln = ranges.high;
    const denom = uln - lln;
    if (!isFinite(denom) || denom <= 0) {
      return;
    }
    
    patientData.data
      .filter(d => d.analyte === analyteName)
      .forEach(d => {
        // Parse date
        const recordDate = this.parseHardcodedDate(d.date);
        if (!recordDate) {
          console.warn(`Could not parse date ${d.date} for patient ${patientId}`);
          return;
        }
        
        // Calculate StudyDay if baseline is available
        let studyDay = null;
        if (baselineDates[patientId]) {
          studyDay = Math.round((recordDate - baselineDates[patientId]) / (1000 * 60 * 60 * 24));
        }
        
        // Pre-calculate normalized value: (Value - LLN) / (ULN - LLN)
        const normalizedValue = (d.value - lln) / denom;
        
        results.push({
          Subject: patientId,
          AnalyteName: analyteName,
          Folder: 'Hardcoded',
          // Raw values from config
          Value: d.value,
          Low: lln,
          High: uln,
          Units: ranges.units,
          // Pre-calculated values
          LLN: lln,
          ULN: uln,
          Norm: normalizedValue,  // Pre-calculated normalized value
          // Metadata
          Date: d.date,
          StudyDay: studyDay,
          ARM: armLookup[patientId] || 'Unknown',
          // Flags
          IsHardcoded: true,
          UseStandard: false  // Hardcoded uses its own system
        });
      });
  });
  
  return results;
};

/**
 * Get all unique analytes that have hardcoded data
 * @returns {Array} Array of analyte names
 */
LABS_CONFIG.getHardcodedAnalytes = function() {
  const analytes = new Set();
  Object.values(this.hardcodedPatients).forEach(patientData => {
    Object.keys(patientData.ranges).forEach(analyteName => {
      const ranges = patientData.ranges[analyteName];
      const hasLow = ranges.low !== null && ranges.low !== undefined && isFinite(ranges.low);
      const hasHigh = ranges.high !== null && ranges.high !== undefined && isFinite(ranges.high) && ranges.high > 0;
      const hasUnits = typeof ranges.units === 'string' && ranges.units.trim() !== '';

      // Only include analytes that have complete ranges and actual data
      if (hasLow && hasHigh && hasUnits && patientData.data.some(d => d.analyte === analyteName)) {
        analytes.add(analyteName);
      }
    });
  });
  return Array.from(analytes).sort();
};

/**
 * Get all patient IDs that have hardcoded data
 * @returns {Array} Array of patient IDs
 */
LABS_CONFIG.getHardcodedPatientIds = function() {
  return Object.keys(this.hardcodedPatients);
};

// Make config available globally
if (typeof window !== 'undefined') {
  window.LABS_CONFIG = LABS_CONFIG;
}
