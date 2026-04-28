import { useMemo } from "react";

export const audits = [
  { id: "AUD-2401", model: "Retail Loan Underwriter", type: "Lending", date: "27 Apr 2026", score: 18.4, severity: "Critical", status: "Complete" },
  { id: "AUD-2398", model: "Hiring Shortlist Ranker", type: "HR", date: "24 Apr 2026", score: 11.8, severity: "High", status: "Complete" },
  { id: "AUD-2381", model: "Insurance Risk Scorer", type: "Insurance", date: "21 Apr 2026", score: 6.2, severity: "Medium", status: "Review" },
  { id: "AUD-2374", model: "Credit Limit Allocator", type: "Banking", date: "18 Apr 2026", score: 3.1, severity: "Passed", status: "Complete" }
];

export const dimensionData = [
  { name: "Caste", value: 18.4, fill: "#EF4444" },
  { name: "Religion", value: 12.1, fill: "#F59E0B" },
  { name: "Region", value: 9.3, fill: "#F59E0B" },
  { name: "Gender", value: 4.8, fill: "#22C55E" }
];

export const trendData = [
  { date: "Feb", caste: 21, religion: 14, region: 11, gender: 7, score: 18 },
  { date: "Mar", caste: 19, religion: 13, region: 10, gender: 6, score: 16 },
  { date: "Apr 1", caste: 17, religion: 12, region: 9, gender: 5, score: 14 },
  { date: "Apr 12", caste: 20, religion: 15, region: 12, gender: 6, score: 17 },
  { date: "Apr 21", caste: 14, religion: 10, region: 8, gender: 4, score: 11 },
  { date: "Apr 27", caste: 18, religion: 12, region: 9, gender: 5, score: 13 }
];

export function useAudit(auditId = "AUD-2401") {
  return useMemo(() => ({
    audit: audits.find((item) => item.id === auditId) || audits[0],
    audits,
    dimensionData,
    trendData,
    loading: false
  }), [auditId]);
}
