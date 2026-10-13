// Python-compatible seeded random generator.
//
// This is a bit-exact port of CPython random.Random for integer seeds,
// which is MT19937 seeded through init_by_array. It exists so seeded
// identifiers in this workshop match the Python reference engine draw
// for draw.

const N = 624;
const M = 397;
const MATRIX_A = 0x9908b0df;
const UPPER_MASK = 0x80000000;
const LOWER_MASK = 0x7fffffff;

export class PythonRandom {
  constructor(seed) {
    this.mt = new Uint32Array(N);
    this.index = N;
    this.seed(seed);
  }

  seed(seed) {
    // CPython splits the absolute value of an integer seed into 32-bit
    // little-endian chunks: seed 7 becomes [7], seed 11 becomes [11].
    let value = BigInt(seed);
    if (value < 0n) value = -value;
    const key = [];
    if (value === 0n) {
      key.push(0);
    } else {
      while (value > 0n) {
        key.push(Number(value & 0xffffffffn));
        value >>= 32n;
      }
    }
    this.initByArray(key);
  }

  initGenrand(s) {
    const mt = this.mt;
    mt[0] = s >>> 0;
    for (let i = 1; i < N; i++) {
      const prev = mt[i - 1];
      const mixed = (prev ^ (prev >>> 30)) >>> 0;
      mt[i] = (Math.imul(1812433253, mixed) + i) >>> 0;
    }
    this.index = N;
  }

  initByArray(key) {
    this.initGenrand(19650218);
    const mt = this.mt;
    let i = 1;
    let j = 0;
    let k = Math.max(N, key.length);
    for (; k > 0; k--) {
      const prev = mt[i - 1];
      const mixed = (prev ^ (prev >>> 30)) >>> 0;
      mt[i] = ((mt[i] ^ Math.imul(mixed, 1664525)) + key[j] + j) >>> 0;
      i++;
      j++;
      if (i >= N) {
        mt[0] = mt[N - 1];
        i = 1;
      }
      if (j >= key.length) j = 0;
    }
    for (k = N - 1; k > 0; k--) {
      const prev = mt[i - 1];
      const mixed = (prev ^ (prev >>> 30)) >>> 0;
      mt[i] = ((mt[i] ^ Math.imul(mixed, 1566083941)) - i) >>> 0;
      i++;
      if (i >= N) {
        mt[0] = mt[N - 1];
        i = 1;
      }
    }
    mt[0] = 0x80000000;
    this.index = N;
  }

  genrandUint32() {
    if (this.index >= N) this.twist();
    let y = this.mt[this.index];
    this.index++;
    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;
    return y >>> 0;
  }

  twist() {
    const mt = this.mt;
    for (let kk = 0; kk < N - M; kk++) {
      const y = ((mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK)) >>> 0;
      mt[kk] = (mt[kk + M] ^ (y >>> 1) ^ (y & 1 ? MATRIX_A : 0)) >>> 0;
    }
    for (let kk = N - M; kk < N - 1; kk++) {
      const y = ((mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK)) >>> 0;
      mt[kk] = (mt[kk + (M - N)] ^ (y >>> 1) ^ (y & 1 ? MATRIX_A : 0)) >>> 0;
    }
    const y = ((mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK)) >>> 0;
    mt[N - 1] = (mt[M - 1] ^ (y >>> 1) ^ (y & 1 ? MATRIX_A : 0)) >>> 0;
    this.index = 0;
  }

  // Mirrors CPython getrandbits. For k <= 32 the result is a Number.
  // For k > 32 words are drawn and assembled with the first drawn word
  // as the least significant, and the result is a BigInt.
  getrandbits(k) {
    if (!Number.isInteger(k) || k < 0) {
      throw new Error("getrandbits requires a non-negative integer");
    }
    if (k === 0) return 0;
    if (k <= 32) {
      if (k === 32) return this.genrandUint32();
      return this.genrandUint32() >>> (32 - k);
    }
    const words = Math.ceil(k / 32);
    let result = 0n;
    for (let i = 0; i < words; i++) {
      let word = BigInt(this.genrandUint32());
      if (i === words - 1) {
        const remaining = k - 32 * (words - 1);
        if (remaining < 32) word >>= BigInt(32 - remaining);
      }
      result |= word << BigInt(32 * i);
    }
    return result;
  }
}

// Alias matching the Python class name.
export const Random = PythonRandom;

// Seeded identifier generation, mirroring ids.SeededIds in the reference.
export class SeededIds {
  constructor(seed) {
    this._rng = new PythonRandom(seed);
    this.seed = seed;
  }

  hex(label, bits = 64) {
    const value = this._rng.getrandbits(bits);
    return label + "-" + BigInt(value).toString(16).padStart(bits / 4, "0");
  }

  nonce() {
    const value = this._rng.getrandbits(128);
    return BigInt(value).toString(16).padStart(32, "0");
  }
}
