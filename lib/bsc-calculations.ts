import type { BSCFormData } from "./validations/bsc";

export function calculatePerformanceScore(objectives: BSCFormData["performanceObjectives"]): number {
	const totalWeightedScore = objectives.reduce((sum, obj) => {
		return sum + (obj.score * obj.percentage) / 100;
	}, 0);

	return Math.round(totalWeightedScore * 100) / 100;
}

export function calculateBehavioralScore(attributes: BSCFormData["behavioralAttributes"]): number {
	const totalWeightedScore = attributes.reduce((sum, attr) => {
		return sum + (attr.score * attr.percentage) / 100;
	}, 0);

	return Math.round(totalWeightedScore * 100) / 100;
}

export function calculateOverallScore(performanceScore: number, behavioralScore: number): number {
	return Math.round((performanceScore + behavioralScore) * 100) / 100;
}

export function getPerformanceLevel(overallScore: number): string {
	if (overallScore >= 90) return "OUTSTANDING";
	if (overallScore >= 80) return "VERY_GOOD";
	if (overallScore >= 70) return "GOOD";
	if (overallScore >= 60) return "SATISFACTORY";
	return "UNSATISFACTORY";
}

export function getPerformanceLevelDescription(level: string): string {
	const descriptions = {
		OUTSTANDING: "Outstanding Performance (90-100%)",
		VERY_GOOD: "Very Good Performance (80-89%)",
		GOOD: "Good Performance (70-79%)",
		SATISFACTORY: "Satisfactory Performance (60-69%)",
		UNSATISFACTORY: "Unsatisfactory Performance (Below 60%)"
	};
	return descriptions[level as keyof typeof descriptions] || "Unknown";
}

export const PERSPECTIVE_ALLOCATIONS = {
	STAKEHOLDERS_CLIENTS: { label: "Stakeholders/Clients", percentage: 25 },
	FINANCIAL_STEWARDSHIP: { label: "Financial Stewardship", percentage: 15 },
	INTERNAL_PROCESSES: { label: "Internal Processes", percentage: 20 },
	MDA_LG_CAPACITY: { label: "MDA/LG Capacity", percentage: 20 }
} as const;
