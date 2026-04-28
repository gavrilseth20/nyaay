from __future__ import annotations

import json
import random
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).parent / "data"


def load_surname_db() -> dict[str, list[str]]:
    return json.loads((DATA_DIR / "surnames.json").read_text())


def load_pincode_db() -> dict[str, list[str]]:
    return json.loads((DATA_DIR / "pincodes.json").read_text())


def _with(row: dict[str, Any], **updates: Any) -> dict[str, Any]:
    clone = dict(row)
    clone.update(updates)
    return clone


def generate_caste_twin(base_row: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    surnames = load_surname_db()
    return _with(base_row, surname=random.choice(surnames["upper_caste"])), _with(base_row, surname=random.choice(surnames["sc_st"]))


def generate_religion_twin(base_row: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    surnames = load_surname_db()
    return _with(base_row, surname=random.choice(surnames["upper_caste"])), _with(base_row, surname=random.choice(surnames["muslim"]))


def generate_region_twin(base_row: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    pincodes = load_pincode_db()
    return _with(base_row, pincode=random.choice(pincodes["metro"])), _with(base_row, pincode=random.choice(pincodes["non_metro"]))


def generate_gender_twin(base_row: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    return _with(base_row, gender="Male"), _with(base_row, gender="Female")
