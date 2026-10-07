"""Seeded identifier generation for deterministic runs.

The Sprint 2 baseline used secrets-based IDs, which made every run unique by
design. The demo needs the opposite: identifiers derived from a declared seed
so that a scenario rerun is a pure function of its manifest plus code version.
"""
from __future__ import annotations

import random


class SeededIds:
    def __init__(self, seed: int) -> None:
        self._rng = random.Random(seed)
        self.seed = seed

    def hex(self, label: str, bits: int = 64) -> str:
        return f"{label}-{self._rng.getrandbits(bits):016x}"

    def nonce(self) -> str:
        return f"{self._rng.getrandbits(128):032x}"
