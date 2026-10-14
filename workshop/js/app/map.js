// The kingdom map: one hand-built inline SVG diagram of the road to
// the gate, in engine order. Built once here and reused in two
// places: the Learn flow (each beat highlights its node) and the step
// runner (the current step's component node is highlighted). Geometry
// lives only in this file, so the two copies can never drift apart.
// Styling lives in css/workshop.css under the .road-map-svg classes.
// No external assets, no images, no animation: highlight changes are
// instant class changes, and meaning is never carried by color alone
// (the active node also gets a heavier outline and a text tag, and
// visited nodes get a check mark).

import { CAST } from "./cast.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl(tag, attrs) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    node.setAttribute(key, value);
  }
  return node;
}

function svgText(x, y, cls, value, anchor) {
  const node = svgEl("text", { x: x, y: y, class: cls, "text-anchor": anchor || "middle" });
  node.textContent = value;
  return node;
}

// Road nodes in engine order, left to right. cx is the center of each
// box; every road box is 140 wide and 78 tall, centered on ROAD_Y.
const ROAD_Y = 172;
const NODES = [
  { id: "counting-house", cx: 84, name: ["The Counting", "House"], concept: "the workload" },
  { id: "herald-post", cx: 240, name: [CAST.heraldName + "'s", "herald post"], concept: "identity" },
  { id: "inspection-yard", cx: 396, name: [CAST.quartermasterName + "'s", "inspection yard"], concept: "attestation" },
  { id: "gatehouse", cx: 552, name: ["The Gatehouse"], concept: "the decision point" },
  { id: "gate", cx: 708, name: ["The Gate"], concept: "enforcement" },
  { id: "vault", cx: 864, name: ["The Ledger Vault"], concept: "the protected resource" },
];

// Off-road places: Grantham's hall above the road (the source of the
// Sealed Letter; the envoy does not visit it during a run) and
// Evidan's scriptorium below the road (everything is written in the
// Chronicle).
const HALL = { id: "hall", cx: 552, cy: 48, w: 168, h: 64, name: [CAST.lord + "'s hall"], concept: "the authority source" };
const SCRIPTORIUM = { id: "scriptorium", cx: 552, cy: 296, w: 188, h: 64, name: ["Evidan's", "scriptorium"], concept: "the evidence ledger" };

// Which map node each engine component belongs to. The Sealed Letter
// is read and checked at the Gatehouse, so grant steps highlight the
// Gatehouse; the letter itself comes from the hall above.
export const COMPONENT_NODE = {
  workload: "counting-house",
  identity: "herald-post",
  grant: "gatehouse",
  attestation: "inspection-yard",
  decision: "gatehouse",
  enforcement: "gate",
  resource: "vault",
  ledger: "scriptorium",
};

// Which map node each Learn beat (by LEARN_PARTS index) belongs to:
// workload, identity, grant, attestation, decision, enforcement,
// ledger.
export const BEAT_NODE = [
  "counting-house",
  "herald-post",
  "gatehouse",
  "inspection-yard",
  "gatehouse",
  "gate",
  "scriptorium",
];

function nodeGroup(id, cx, cy, w, h, nameLines, concept) {
  const g = svgEl("g", { class: "map-node", "data-node": id });
  g.append(svgEl("rect", { class: "map-box", x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 8 }));
  g.append(svgText(cx - w / 2 + 12, cy - h / 2 + 18, "map-check", "✓"));
  g.append(svgText(cx, cy - h / 2 + 15, "map-tag", ""));
  nameLines.forEach((line, i) => {
    const y = nameLines.length === 1 ? cy + 6 : cy + (i === 0 ? 0 : 16);
    g.append(svgText(cx, y, "map-name", line));
  });
  g.append(svgText(cx, cy + h / 2 - 9, "map-concept", concept));
  return g;
}

export function buildRoadMap() {
  const svg = svgEl("svg", {
    class: "road-map-svg",
    viewBox: "0 0 960 360",
    role: "img",
    "aria-label": "Map of the road to the gate: " + CAST.envoy + " starts at the Counting House, " +
      "passes " + CAST.heraldName + "'s herald post and " + CAST.quartermasterName + "'s inspection yard, " +
      "is decided on at the Gatehouse by " + CAST.steward + ", passes " + CAST.guard + " at the Gate, " +
      "and reaches the Ledger Vault, while " + CAST.lord + "'s hall above the road is the source of the " +
      "Sealed Letter and " + CAST.scribe + "'s scriptorium below the road writes everything in the Chronicle.",
  });

  // The road itself, drawn first so the node boxes sit on top of it.
  svg.append(svgEl("line", { class: "map-road", x1: 14, y1: ROAD_Y, x2: 946, y2: ROAD_Y }));
  svg.append(svgEl("path", { class: "map-road-head", d: "M 946 " + ROAD_Y + " l -12 -6 v 12 z" }));

  // Thin lines from every stage down to the scriptorium: everything
  // is written in the Chronicle.
  const scriptTop = SCRIPTORIUM.cy - SCRIPTORIUM.h / 2;
  NODES.forEach((node, i) => {
    const targetX = SCRIPTORIUM.cx - 60 + i * 24;
    svg.append(svgEl("line", {
      class: "map-link",
      x1: node.cx, y1: ROAD_Y + 39,
      x2: targetX, y2: scriptTop,
    }));
  });

  // Dashed line from the hall down to the Gatehouse: the letter comes
  // from the hall; the envoy does not visit it during a run.
  const hallBottom = HALL.cy + HALL.h / 2;
  const gatehouseTop = ROAD_Y - 39;
  svg.append(svgEl("line", {
    class: "map-grant-line",
    x1: HALL.cx, y1: hallBottom,
    x2: HALL.cx, y2: gatehouseTop,
  }));
  svg.append(svgText(HALL.cx + 10, hallBottom + 26, "map-note", "the Sealed Letter", "start"));
  svg.append(svgText(HALL.cx + 10, hallBottom + 41, "map-note", "comes from the hall", "start"));

  for (const node of NODES) {
    svg.append(nodeGroup(node.id, node.cx, ROAD_Y, 140, 78, node.name, node.concept));
  }
  svg.append(nodeGroup(HALL.id, HALL.cx, HALL.cy, HALL.w, HALL.h, HALL.name, HALL.concept));
  svg.append(nodeGroup(SCRIPTORIUM.id, SCRIPTORIUM.cx, SCRIPTORIUM.cy,
    SCRIPTORIUM.w, SCRIPTORIUM.h, SCRIPTORIUM.name, "the evidence ledger"));

  svg.append(svgText(480, 352, "map-caption", "Everything is written in the Chronicle."));
  return svg;
}

// Sets the highlight state of a built map. `activeId` is the node the
// request is at now (null for none), `visitedIds` are the nodes
// already passed, and `tagText` is the active node's tag ("you are
// here" in the Learn flow, "the request is here" in the runner). The
// active node is never also marked visited.
export function setRoadMapState(svg, activeId, visitedIds, tagText) {
  if (!svg) return;
  const visited = new Set(visitedIds || []);
  svg.querySelectorAll(".map-node").forEach((g) => {
    const id = g.getAttribute("data-node");
    const active = id === activeId;
    g.classList.toggle("is-active", active);
    g.classList.toggle("is-visited", !active && visited.has(id));
    const tag = g.querySelector(".map-tag");
    if (tag) tag.textContent = active ? tagText : "";
  });
}
