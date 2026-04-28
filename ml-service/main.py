from __future__ import annotations

import random
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel, Field

from bias_engine import chi_squared_test, compute_disparity, flag_bias, generate_report_text, severity_for

app = FastAPI(title="Nyaay Bias Analysis Service")


class AuditRequest(BaseModel):
    uploadPath: str | None = None
    dimensions: list[str] = Field(default_factory=lambda: ["caste", "religion", "region", "gender"])
    profileCount: int = 5000
    confidenceThreshold: float = 10
    auditId: str


def synthetic_outcomes(dimension: str, count: int) -> tuple[list[int], list[int], str]:
    base_rates = {
        "caste": (0.72, 0.54, "SC/ST surname clusters"),
        "religion": (0.70, 0.58, "Muslim-majority pincode clusters"),
        "region": (0.69, 0.60, "Non-metro applicants"),
        "gender": (0.67, 0.63, "Female applicants"),
        "language": (0.68, 0.59, "Vernacular language applicants"),
        "age": (0.66, 0.61, "Older applicants"),
    }
    rate_a, rate_b, affected = base_rates.get(dimension.lower().split()[0], (0.67, 0.62, "Protected proxy group"))
    sample_size = max(100, min(count // 2, 2500))
    group_a = [1 if random.random() < rate_a else 0 for _ in range(sample_size)]
    group_b = [1 if random.random() < rate_b else 0 for _ in range(sample_size)]
    return group_a, group_b, affected


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.post("/run-audit")
def run_audit(request: AuditRequest) -> dict[str, Any]:
    dimension_results = {}
    threshold = 100 - request.confidenceThreshold if request.confidenceThreshold > 1 else request.confidenceThreshold * 100
    threshold = max(5, threshold)

    for dimension in request.dimensions:
        group_a, group_b, affected_group = synthetic_outcomes(dimension, request.profileCount)
        disparity = compute_disparity(group_a, group_b)
        p_value = chi_squared_test(group_a, group_b)
        dimension_results[dimension] = {
            "disparity": round(disparity, 2),
            "affectedGroup": affected_group,
            "confidence": request.confidenceThreshold,
            "flagged": flag_bias(disparity, p_value, threshold),
            "pValue": round(p_value, 5),
        }

    overall_score = max(result["disparity"] for result in dimension_results.values()) if dimension_results else 0
    return {
        "auditId": request.auditId,
        "status": "complete",
        "results": {
            "overallScore": round(overall_score, 2),
            "severity": severity_for(overall_score),
            "dimensions": dimension_results,
            "summary": generate_report_text(dimension_results),
        },
    }
