// Injectable clock, mirroring clock.py in the reference engine.
// Time is held as epoch milliseconds. All scenario times are whole
// seconds, so formatting never needs a fractional part.

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function isoformat(ms) {
  const d = new Date(ms);
  return (
    String(d.getUTCFullYear()).padStart(4, "0") +
    "-" + pad2(d.getUTCMonth() + 1) +
    "-" + pad2(d.getUTCDate()) +
    "T" + pad2(d.getUTCHours()) +
    ":" + pad2(d.getUTCMinutes()) +
    ":" + pad2(d.getUTCSeconds()) +
    "Z"
  );
}

export function parseIso(value) {
  return Date.parse(value);
}

export class ManualClock {
  constructor(startMs) {
    this._now = startMs;
  }

  now() {
    return this._now;
  }

  advance(seconds) {
    this._now = this._now + seconds * 1000;
  }

  set(momentMs) {
    this._now = momentMs;
  }
}
