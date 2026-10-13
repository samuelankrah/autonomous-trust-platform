// Deterministic stand-in message authentication, consistent with the
// scenario contract. Signature and hash values are outside parity; only
// presence and key_id shape matter. This models the reference crypto
// module behavior: signing canonical JSON claims with a key, and
// verification by recomputation, so altering claims after signing fails.
//
// The hash is FNV-1a 64-bit run in four passes with different offset
// seeds over the canonical text, producing a 64 hex character string.
// It is a teaching stand-in, not production cryptography.

import { canonicalJson } from "./canonical.js";

export const ALGORITHM = "HMAC-SHA256";
export const KEY_LABEL = "synthetic-not-for-production";

const FNV_PRIME = 0x100000001b3n;
const MASK_64 = 0xffffffffffffffffn;
const OFFSET_BASIS = 0xcbf29ce484222325n;

function fnv1a64(text, seed) {
  let hash = seed & MASK_64;
  for (let i = 0; i < text.length; i++) {
    hash ^= BigInt(text.charCodeAt(i) & 0xff);
    hash = (hash * FNV_PRIME) & MASK_64;
  }
  return hash;
}

function hashText(text, keyText) {
  let out = "";
  for (let pass = 0; pass < 4; pass++) {
    const seed = OFFSET_BASIS ^ BigInt(0x9e3779b9 * (pass + 1));
    const mixed = keyText + "\n" + String(pass) + "\n" + text;
    out += fnv1a64(mixed, seed).toString(16).padStart(16, "0");
  }
  return out;
}

export function digest(value) {
  return hashText(canonicalJson(value), "");
}

export function sign(claims, key) {
  return hashText(canonicalJson(claims), String(key));
}

export function verify(claims, signature, key) {
  if (typeof signature !== "string" || signature.length === 0) return false;
  return sign(claims, key) === signature;
}

export function fingerprint(value) {
  return digest(value);
}
