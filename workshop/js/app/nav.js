// Navigation state for the workshop: the stack of screens the
// learner has visited, and the gate that keeps Reset behind an
// explicit confirmation. This module is DOM free: it never touches
// document or window, so it can be unit tested in Node. main.js owns
// all rendering; this module owns only the rules.
//
// Screen stack rules:
// - visit() records arriving at a screen. Consecutive duplicates are
//   ignored, so re-rendering the current screen never grows the stack.
// - back() removes the current screen and returns the screen to land
//   on, or null when there is nowhere to go back to.
// - The stack never decides whether a screen may be shown: the
//   showScreen guard in main.js (outcome screens need a recorded
//   prediction) still runs for every landing, including Back landings.

export class ScreenStack {
  constructor() {
    this._stack = [];
  }

  visit(n) {
    if (this._stack[this._stack.length - 1] !== n) this._stack.push(n);
    return this.current();
  }

  current() {
    return this._stack.length ? this._stack[this._stack.length - 1] : null;
  }

  back() {
    this._stack.pop();
    return this.current();
  }

  clear() {
    this._stack = [];
  }

  size() {
    return this._stack.length;
  }
}

// Reset gate: Reset does nothing until the learner has opened the
// confirmation and then chosen to confirm. One gate instance is
// shared by every Reset control in the app (the global navigation bar
// and the Repair screen), so the two can never drift apart.
export class ResetGate {
  constructor() {
    this._open = false;
  }

  get isOpen() {
    return this._open;
  }

  open() {
    this._open = true;
  }

  close() {
    this._open = false;
  }

  // Runs the reset action only while the confirmation is open, and
  // closes the gate either way the action goes. Returns true when the
  // action ran, false when there was nothing confirmed to run.
  confirm(action) {
    if (!this._open) return false;
    this._open = false;
    action();
    return true;
  }
}
