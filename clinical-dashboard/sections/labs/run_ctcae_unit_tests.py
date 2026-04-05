from __future__ import annotations

import json
from pathlib import Path

import quickjs


HTML_PATH = Path(__file__).with_name("ctcae-grade-summary.html")
RESULT_PATH = Path(__file__).with_name("ctcae-unit-test-results.txt")


def extract_ctcae_script(html_text: str) -> str:
    marker = "// ============================================\n// CTCAE v5.0 GRADING FUNCTIONS"
    start = html_text.find(marker)
    if start < 0:
        raise RuntimeError("Cannot find CTCAE grading script start marker.")

    end = html_text.rfind("</script>")
    if end < 0 or end <= start:
        raise RuntimeError("Cannot find CTCAE grading script end marker.")

    return html_text[start:end]


def run_tests() -> dict:
    html_text = HTML_PATH.read_text(encoding="utf-8")
    js_code = extract_ctcae_script(html_text)

    console_logs: list[str] = []
    storage: dict[str, str | None] = {}

    ctx = quickjs.Context()

    def py_log(*args):
        console_logs.append(" ".join("" if a is None else str(a) for a in args))

    def storage_get(key):
        return storage.get(str(key))

    def storage_set(key, value):
        storage[str(key)] = None if value is None else str(value)
        return None

    ctx.add_callable("__py_log", py_log)
    ctx.add_callable("__storage_get", storage_get)
    ctx.add_callable("__storage_set", storage_set)

    bootstrap = r"""
var console = {
  log: function(){ __py_log.apply(null, arguments); },
  warn: function(){ __py_log.apply(null, arguments); },
  error: function(){ __py_log.apply(null, arguments); },
  table: function(){ __py_log('[console.table called]'); }
};

function DummyElement() {
  this.textContent = '';
  this.innerHTML = '';
  this.value = '';
  this.checked = false;
  this.dataset = {};
  this.style = {};
  this.className = '';
  this.classList = {
    add: function(){},
    remove: function(){},
    contains: function(){ return false; }
  };
}

DummyElement.prototype.appendChild = function(){};
DummyElement.prototype.addEventListener = function(){};
DummyElement.prototype.removeEventListener = function(){};
DummyElement.prototype.scrollIntoView = function(){};
DummyElement.prototype.querySelectorAll = function(){ return []; };
DummyElement.prototype.querySelector = function(){ return null; };

var document = {
  addEventListener: function(){},
  getElementById: function(){ return new DummyElement(); },
  querySelectorAll: function(){ return []; },
  querySelector: function(){ return null; }
};

var localStorage = {
  getItem: function(key){ return __storage_get(String(key)); },
  setItem: function(key, value){ __storage_set(String(key), String(value)); },
  removeItem: function(key){ __storage_set(String(key), null); }
};

var window = {};
"""

    ctx.eval(bootstrap + "\n" + js_code)
    report_json = ctx.eval("JSON.stringify(runCTCAEUnitTests())")
    if not report_json:
        raise RuntimeError("runCTCAEUnitTests() returned empty result.")

    report = json.loads(report_json)
    report["console_logs"] = console_logs
    return report


def write_report(report: dict) -> None:
    lines = [
        "CTCAE v5.0 Unit Test Results",
        "=" * 32,
        f"Timestamp: {report.get('timestamp', '-')}",
        f"Total checks: {report.get('totalChecks', 0)}",
        f"Passed: {report.get('passed', 0)}",
        f"Failed: {report.get('failed', 0)}",
        "",
        "Failures:"
    ]

    failures = report.get("failures") or []
    if failures:
        lines.extend(f"- {msg}" for msg in failures)
    else:
        lines.append("- None")

    logs = report.get("console_logs") or []
    lines.extend([
        "",
        "Console logs captured during execution:"
    ])
    if logs:
        lines.extend(f"- {msg}" for msg in logs)
    else:
        lines.append("- None")

    RESULT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    report = run_tests()
    write_report(report)
    print(
        f"CTCAE tests finished: total={report.get('totalChecks', 0)} "
        f"passed={report.get('passed', 0)} failed={report.get('failed', 0)}"
    )
    return 1 if report.get("failed", 0) else 0


if __name__ == "__main__":
    raise SystemExit(main())
