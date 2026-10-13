// Canonical JSON matching Python json.dumps with sort_keys=True and
// separators=(",", ":"). Object keys are sorted recursively, arrays keep
// their order, and strings use JSON escaping. The data in this engine is
// ASCII, integers, booleans, null, strings, arrays, and plain objects.

export function canonicalJson(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("non-finite number in canonical JSON");
    return JSON.stringify(value);
  }
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return "[" + value.map((item) => canonicalJson(item)).join(",") + "]";
  }
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    const parts = keys.map((key) => JSON.stringify(key) + ":" + canonicalJson(value[key]));
    return "{" + parts.join(",") + "}";
  }
  throw new Error("unsupported value in canonical JSON: " + typeof value);
}

export const canonicalJSONStringify = canonicalJson;

export function deepClone(value) {
  if (value === null || value === undefined) return value;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
