/**
 * ECG / QTcF Analysis - Shared Data Module
 * Used by index.html (Overview), listing.html (Listing), individual.html (Individual Profiles)
 */

// ====================================================================
// Global State
// ====================================================================
var STATE = {
  raw: [],
  patients: [],       // Sorted patient IDs
  visits: [],         // Master visit order (sorted by earliest datetime)
  byPatient: {},      // { patientId: { visitName: { readings, avg, min, max } } }
  charts: {},
  hiddenPatients: new Set()
};

// ====================================================================
// ECG Parameter Configuration
// ====================================================================
var ECG_METRICS = {
  qtcf_value: {
    key: 'value', label: 'QTcF Absolute Value (ms)', unit: 'ms',
    refLines: [
      { val: 450, color: 'orange', label: '450ms Borderline' },
      { val: 480, color: 'red', label: '480ms Prolonged' }
    ],
    classify: function(val) {
      if (val >= 480) return 'prolonged';
      if (val >= 450) return 'borderline';
      return 'normal';
    },
    statLabels: { borderline: 'Borderline (\u2265450)', prolonged: 'Prolonged (\u2265480)' }
  },
  qtcf_change: {
    key: 'change', label: 'QTcF Change from Baseline (ms)', unit: 'ms',
    refLines: [
      { val: 30, color: 'orange', label: '30ms Borderline' },
      { val: 60, color: 'red', label: '60ms Prolonged' }
    ],
    classify: function(val) {
      if (val >= 60) return 'prolonged';
      if (val >= 30) return 'borderline';
      return 'normal';
    },
    statLabels: { borderline: 'Borderline (\u226530)', prolonged: 'Prolonged (\u226560)' }
  },
  pr: {
    key: 'pr', label: 'PR Interval (ms)', unit: 'ms',
    refLines: [
      { val: 200, color: 'red', label: '\u2265200ms Prolonged' }
    ],
    classify: function(val) {
      if (val >= 200) return 'prolonged';
      return 'normal';
    },
    statLabels: { prolonged: 'Abnormal (\u2265200ms)' }
  },
  qrs: {
    key: 'qrs', label: 'QRS Duration (ms)', unit: 'ms',
    refLines: [
      { val: 120, color: 'red', label: '\u2265120ms Prolonged' }
    ],
    classify: function(val) {
      if (val >= 120) return 'prolonged';
      return 'normal';
    },
    statLabels: { prolonged: 'Abnormal (\u2265120ms)' }
  },
  hr: {
    key: 'hr', label: 'Heart Rate (bpm)', unit: 'bpm',
    refLines: [
      { val: 50, color: 'red', label: '<50 Bradycardia' },
      { val: 100, color: 'red', label: '>100 Tachycardia' }
    ],
    classify: function(val) {
      if (val < 50) return 'prolonged';
      if (val > 100) return 'prolonged';
      return 'normal';
    },
    statLabels: { prolonged: 'Abnormal (<50 or >100)' }
  }
};

// ====================================================================
// Color Generation - Golden angle for maximum visual spread
// ====================================================================
function getColor(index, alpha) {
  if (alpha === undefined) alpha = 1;
  var hue = (index * 137.508) % 360;
  return 'hsla(' + hue + ', 65%, 50%, ' + alpha + ')';
}

// ====================================================================
// Data Loading
// ====================================================================
async function loadXLSX(url) {
  var resp = await fetch(url);
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  var buf = await resp.arrayBuffer();
  var wb = XLSX.read(buf, { type: 'array' });
  var ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws);
}

async function loadCSV(url) {
  return new Promise(function(resolve, reject) {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function(r) { resolve(r.data); },
      error: function(e) { reject(e); }
    });
  });
}

async function loadData() {
  var paths = [
    { url: '../../data/Export_ECG_new.xlsx', loader: loadXLSX },
    { url: '../../data/Export_ECG_new.csv', loader: loadCSV },
    { url: '../../data/ecg.csv', loader: loadCSV },
    { url: '../../data/ECG.csv', loader: loadCSV },
    { url: '../../data/Export_ECG.csv', loader: loadCSV }
  ];
  for (var i = 0; i < paths.length; i++) {
    try {
      var data = await paths[i].loader(paths[i].url);
      if (data && data.length > 0) {
        console.log('Loaded ' + data.length + ' rows from ' + paths[i].url);
        return data;
      }
    } catch (e) {
      console.warn('Failed: ' + paths[i].url, e.message);
    }
  }
  throw new Error('No ECG data file found. Ensure Export_ECG_new.xlsx or .csv is in the data folder.');
}

// ====================================================================
// Column Detection
// ====================================================================
var COL_CANDIDATES = {
  subject: ['Subject Number', 'Subject', 'Patient Key', 'Patient.Key', 'USUBJID', 'SUBJID'],
  visit: ['Visit Name', 'Visit.Name', 'Visit', 'Folder', 'FOLDER'],
  datetime: ['CollectionDateTime', 'Collection DateTime', 'Collection Date Time',
              'Collection Datetime', 'AcquisitionDateTime', 'Acquisition DateTime',
              'Collection Date', 'CollectionDate'],
  value: ['QTcF Value', 'QTcF', 'QTcF (ms)', 'QTcF (msec)', 'QTcF msec'],
  baseline: ['QTcF Baseline Mean', 'QTcF Baseline', 'Baseline Mean', 'QTcF Base Mean'],
  change: ['QTcF Change from Base', 'QTcF Change from Baseline', 'QTcF Change',
           'QTcF Delta', 'Delta QTcF'],
  pr: ['PR Interval', 'PR Interval Value', 'PR Value', 'PR (ms)', 'PR Interval (ms)',
       'PR Duration', 'PRINT', 'PR', 'PR Interval (msec)'],
  qrs: ['QRS Duration', 'QRS Duration Value', 'QRS Value', 'QRS (ms)', 'QRS Duration (ms)',
        'QRS Interval', 'QRSDUR', 'QRS', 'QRS Duration (msec)'],
  hr: ['Ventricular Heart Rate', 'Heart Rate', 'HR Value', 'HR (bpm)',
       'Heart Rate (bpm)', 'HR', 'EGHR', 'Ventricular Heart Rate Value', 'Ventricular Rate']
};

function findCol(candidates, headers) {
  for (var i = 0; i < candidates.length; i++) {
    if (headers.indexOf(candidates[i]) >= 0) return candidates[i];
    for (var j = 0; j < headers.length; j++) {
      if (headers[j].trim() === candidates[i].trim()) return headers[j];
    }
  }
  for (var i = 0; i < candidates.length; i++) {
    var cl = candidates[i].trim().toLowerCase();
    for (var j = 0; j < headers.length; j++) {
      if (headers[j].trim().toLowerCase() === cl) return headers[j];
    }
  }
  return null;
}

// ====================================================================
// Date Parsing
// ====================================================================
function parseDate(str) {
  if (!str || String(str).trim() === '') return null;
  var s = String(str).trim();

  var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (m) return new Date(+m[3], +m[1]-1, +m[2], +m[4], +m[5], +(m[6]||0));

  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (m) return new Date(+m[1], +m[2]-1, +m[3], +m[4], +m[5], +(m[6]||0));

  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return new Date(+m[1], +m[2]-1, +m[3]);

  if (/^\d+(\.\d+)?$/.test(s)) {
    var serial = parseFloat(s);
    if (serial > 30000 && serial < 60000) {
      var d = new Date((serial - 25569) * 86400000);
      if (!isNaN(d.getTime())) return d;
    }
  }
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// ====================================================================
// Visit Name Normalization
// Merges A/B/C replicate visits into one base visit name.
// e.g. "CYCLE 0 DAY -1 PREDOSE A" -> "CYCLE 0 DAY -1 PREDOSE"
//      "C1D1 1H POST /"           -> "C1D1 1H POST"
// ====================================================================
function normalizeVisit(v) {
  var s = String(v).trim();
  // Remove trailing " /" or "/"
  s = s.replace(/\s*\/\s*$/, '').trim();
  // Remove trailing single-letter replicate marker: " A", " B", " C", etc.
  // Only strip if the last segment is exactly one uppercase letter preceded by a space
  s = s.replace(/\s+[A-C]$/i, '').trim();
  return s;
}

// ====================================================================
// Data Processing
// ====================================================================
function processData() {
  var data = STATE.raw;
  if (!data.length) return;

  var headers = Object.keys(data[0]);
  console.log('Headers:', headers);

  var colSubject  = findCol(COL_CANDIDATES.subject, headers);
  var colVisit    = findCol(COL_CANDIDATES.visit, headers);
  var colDatetime = findCol(COL_CANDIDATES.datetime, headers);
  var colValue    = findCol(COL_CANDIDATES.value, headers);
  var colBaseline = findCol(COL_CANDIDATES.baseline, headers);
  var colChange   = findCol(COL_CANDIDATES.change, headers);

  var colPR      = findCol(COL_CANDIDATES.pr, headers);
  var colQRS     = findCol(COL_CANDIDATES.qrs, headers);
  var colHR      = findCol(COL_CANDIDATES.hr, headers);

  console.log('Columns:', { subject: colSubject, visit: colVisit, datetime: colDatetime,
    value: colValue, baseline: colBaseline, change: colChange, pr: colPR, qrs: colQRS, hr: colHR });

  if (!colSubject || !colVisit)
    throw new Error('Missing required columns: Subject or Visit');

  // Parse rows (exclude UNSCHEDULED visits)
  var rows = [];
  for (var i = 0; i < data.length; i++) {
    var r = data[i];
    var patient = String(r[colSubject] || '').trim();
    var visit = normalizeVisit(r[colVisit] || '');
    if (!patient || !visit) continue;
    // Skip UNSCHEDULED visits entirely
    if (/^UNSCHEDULED$/i.test(visit)) continue;
    rows.push({
      patient: patient, visit: visit,
      datetime: colDatetime ? parseDate(r[colDatetime]) : null,
      value: colValue ? parseFloat(r[colValue]) : NaN,
      baseline: colBaseline ? parseFloat(r[colBaseline]) : NaN,
      change: colChange ? parseFloat(r[colChange]) : NaN,
      pr: colPR ? parseFloat(r[colPR]) : NaN,
      qrs: colQRS ? parseFloat(r[colQRS]) : NaN,
      hr: colHR ? parseFloat(r[colHR]) : NaN
    });
  }

  // Group by patient -> visit
  var byPatient = {};
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (!byPatient[r.patient]) byPatient[r.patient] = {};
    if (!byPatient[r.patient][r.visit]) byPatient[r.patient][r.visit] = { readings: [] };
    byPatient[r.patient][r.visit].readings.push(r);
  }

  // Calculate avg / min / max per visit per patient
  var patientIds = Object.keys(byPatient).sort();
  patientIds.forEach(function(pid) {
    Object.keys(byPatient[pid]).forEach(function(v) {
      var readings = byPatient[pid][v].readings;
      var vals     = readings.map(function(r){return r.value;}).filter(function(x){return isFinite(x);});
      var changes  = readings.map(function(r){return r.change;}).filter(function(x){return isFinite(x);});
      var baselines= readings.map(function(r){return r.baseline;}).filter(function(x){return isFinite(x);});
      var prs      = readings.map(function(r){return r.pr;}).filter(function(x){return isFinite(x);});
      var qrss     = readings.map(function(r){return r.qrs;}).filter(function(x){return isFinite(x);});
      var hrs      = readings.map(function(r){return r.hr;}).filter(function(x){return isFinite(x);});

      byPatient[pid][v].avg = {
        value:    vals.length     ? vals.reduce(function(a,b){return a+b;},0)/vals.length : NaN,
        change:   changes.length  ? changes.reduce(function(a,b){return a+b;},0)/changes.length : NaN,
        baseline: baselines.length? baselines.reduce(function(a,b){return a+b;},0)/baselines.length : NaN,
        pr:       prs.length      ? prs.reduce(function(a,b){return a+b;},0)/prs.length : NaN,
        qrs:      qrss.length     ? qrss.reduce(function(a,b){return a+b;},0)/qrss.length : NaN,
        hr:       hrs.length      ? hrs.reduce(function(a,b){return a+b;},0)/hrs.length : NaN
      };
      byPatient[pid][v].min = {
        value:  vals.length    ? Math.min.apply(null, vals) : NaN,
        change: changes.length ? Math.min.apply(null, changes) : NaN,
        pr:     prs.length     ? Math.min.apply(null, prs) : NaN,
        qrs:    qrss.length    ? Math.min.apply(null, qrss) : NaN,
        hr:     hrs.length     ? Math.min.apply(null, hrs) : NaN
      };
      byPatient[pid][v].max = {
        value:  vals.length    ? Math.max.apply(null, vals) : NaN,
        change: changes.length ? Math.max.apply(null, changes) : NaN,
        pr:     prs.length     ? Math.max.apply(null, prs) : NaN,
        qrs:    qrss.length    ? Math.max.apply(null, qrss) : NaN,
        hr:     hrs.length     ? Math.max.apply(null, hrs) : NaN
      };
    });
  });

  // Master visit order — sort ALL unique visits by earliest datetime
  var visitDateMap = {};
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (r.datetime) {
      if (!visitDateMap[r.visit] || r.datetime < visitDateMap[r.visit])
        visitDateMap[r.visit] = r.datetime;
    }
  }
  var allVisitsSet = {};
  for (var i = 0; i < rows.length; i++) allVisitsSet[rows[i].visit] = true;
  var allVisits = Object.keys(allVisitsSet);
  // Helper: check if a visit name is an "end" visit that should always appear last
  function isEndVisit(v) {
    return /^END OF TREATMENT/i.test(v) || /^SAFETY FOLLOW/i.test(v);
  }
  allVisits.sort(function(a, b) {
    var aEnd = isEndVisit(a), bEnd = isEndVisit(b);
    // End visits always go to the very end
    if (aEnd && !bEnd) return 1;
    if (!aEnd && bEnd) return -1;
    // Among end visits, SAFETY FOLLOW UP goes after END OF TREATMENT
    if (aEnd && bEnd) {
      var aFollow = /SAFETY FOLLOW/i.test(a), bFollow = /SAFETY FOLLOW/i.test(b);
      if (aFollow && !bFollow) return 1;
      if (!aFollow && bFollow) return -1;
    }
    var da = visitDateMap[a], db = visitDateMap[b];
    if (da && db) return da - db;
    if (da) return -1;
    if (db) return 1;
    return a.localeCompare(b);
  });

  STATE.byPatient = byPatient;
  STATE.patients  = patientIds;
  STATE.visits    = allVisits;
  console.log('Processed: ' + patientIds.length + ' patients, ' + allVisits.length + ' visits');
}

// ====================================================================
// Reference Lines Plugin (shared by charts)
// ====================================================================
function getRefLinesPlugin(pluginId) {
  return {
    id: pluginId,
    beforeDraw: function(chart) {
      var refCheck = document.getElementById('showRefLines');
      if (refCheck && !refCheck.checked) return;
      var metricSel = document.getElementById('metricSelect');
      var metricId = metricSel ? metricSel.value : 'qtcf_value';
      var metricConfig = ECG_METRICS[metricId];
      if (!metricConfig || !metricConfig.refLines) return;

      var ctx = chart.ctx;
      var yScale = chart.scales.y;
      var area = chart.chartArea;
      if (!area) return;

      ctx.save();
      metricConfig.refLines.forEach(function(l) {
        if (l.val >= yScale.min && l.val <= yScale.max) {
          var py = yScale.getPixelForValue(l.val);
          ctx.beginPath(); ctx.strokeStyle = l.color; ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.moveTo(area.left, py); ctx.lineTo(area.right, py); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = l.color; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'right';
          ctx.fillText(l.label, area.right - 8, py - 6);
        }
      });
      ctx.restore();
    }
  };
}

// ====================================================================
// Master Init — call from each page
// ====================================================================
async function initECGData() {
  STATE.raw = await loadData();
  processData();
}
