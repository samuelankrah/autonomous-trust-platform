"""Injectable clock for the decision-service demo.

Wall-clock time is forbidden in decision paths (Task 6 FR-024 testability).
Every component that reasons about freshness, expiry, or validity receives a
Clock instance. Scenario manifests declare the clock start and any fault
offsets, so runs are deterministic.

A system-clock implementation exists for interactive development only. The
scenario runner refuses to produce evidence bundles with it.
"""
from __future__ import annotations

from datetime import UTC, datetime, timedelta


def isoformat(dt: datetime) -> str:
    return dt.astimezone(UTC).isoformat().replace("+00:00", "Z")


def parse_iso(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


class Clock:
    """Abstract time source."""

    def now(self) -> datetime:
        raise NotImplementedError


class ManualClock(Clock):
    """Deterministic clock. The only clock permitted for evidence runs."""

    def __init__(self, start: datetime) -> None:
        self._now = start

    def now(self) -> datetime:
        return self._now

    def advance(self, seconds: int) -> None:
        self._now = self._now + timedelta(seconds=seconds)

    def set(self, moment: datetime) -> None:
        self._now = moment


class SystemClock(Clock):
    """Wall clock. Development only; the runner bars it from evidence.

    Supports advance/set via an offset so scenario code stays uniform in
    fast mode. The offset is wall-clock-relative, therefore never
    deterministic, which is exactly why fast mode cannot produce evidence.
    """

    def __init__(self) -> None:
        self._offset = timedelta(0)

    def now(self) -> datetime:
        return datetime.now(UTC) + self._offset

    def advance(self, seconds: int) -> None:
        self._offset = self._offset + timedelta(seconds=seconds)

    def set(self, moment: datetime) -> None:
        self._offset = moment - datetime.now(UTC)
