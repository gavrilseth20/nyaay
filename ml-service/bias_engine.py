from __future__ import annotations

from typing import Iterable

import numpy as np
from scipy.stats import chi2_contingency


def compute_disparity(group_a_outcomes: Iterable[int], group_b_outcomes: Iterable[int]) -> float:
    a = np.array(list(group_a_outcomes), dtype=float)
    b = np.array(list(group_b_outcomes), dtype=float)
    if len(a) == 0 or len(b) == 0:
        return 0.0
    return float(abs(a.mean() - b.mean()) * 100)


def chi_squared_test(outcomes_a: Iterable[int], outcomes_b: Iterable[int]) -> float:
    a = np.array(list(outcomes_a), dtype=int)
    b = np.array(list(outcomes_b), dtype=int)
    table = [
        [int(a.sum()), int(len(a) - a.sum())],
        [int(b.sum()), int(len(b) - b.sum())],
    ]
    try:
        _, p_value, _, _ = chi2_contingency(table)
        return float(p_value)
    except ValueError:
        return 1.0


def flag_bias(disparity: float, p_value: float, threshold: float) -> bool:
    return disparity > threshold and p_value < 0.05


def severity_for(disparity: float) -> str:
    if disparity >= 15:
        return "critical"
    if disparity >= 10:
        return "high"
    if disparity >= 5:
        return "medium"
    return "passed"


def generate_report_text(results: dict) -> str:
    flagged = [name for name, result in results.items() if result["flagged"]]
    if not flagged:
        return "No statistically significant disparity was detected at the selected confidence threshold."
    return (
        "Statistically significant disparity was detected for "
        + ", ".join(flagged)
        + ". Review protected proxy features, rebalance representation and apply fairness constraints before production deployment."
    )
