import { PerformanceObjective, PerspectiveType } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { differenceInDays, differenceInHours, differenceInMinutes, format, getMonth, getYear, isToday, isYesterday } from "date-fns";
import { twMerge } from "tailwind-merge";
import { perspectives } from "./constants";
import { PerspectiveGroup } from "./types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
	const now = new Date();

	const minutesDiff = differenceInMinutes(now, date);
	const hoursDiff = differenceInHours(now, date);
	const daysDiff = differenceInDays(now, date);

	if (minutesDiff < 1) {
		return "just now";
	}
	if (minutesDiff < 60) {
		return `${minutesDiff}m ago`;
	}
	if (hoursDiff < 24 && isToday(date)) {
		return `${hoursDiff}h ago`;
	}
	if (isYesterday(date)) {
		return "yesterday";
	}
	if (daysDiff < 7) {
		return `${daysDiff}d ago`;
	}
	if (daysDiff < 365) {
		return format(date, "MMM d"); // e.g. "Mar 3"
	}
	return format(date, "MMM yyyy"); // e.g. "Aug 2022"
}

export function groupByPerspective(performanceObjectives: PerformanceObjective[]) {
	const groups: Record<string, PerspectiveGroup> = {};

	for (const obj of performanceObjectives) {
		if (!groups[obj.perspective]) {
			groups[obj.perspective] = {
				perspective: obj.perspective,
				percentage: 0, // start at 0 and sum later
				objectives: []
			};
		}

		// add to total percentage for this perspective
		groups[obj.perspective].percentage += obj.percentage;

		// push this objective
		groups[obj.perspective].objectives.push({
			objective: obj.objective,
			percentage: obj.percentage,
			actions: obj.actions.map((a) => ({ action: a })),
			expectedResults: obj.expectedResults.map((r) => ({ result: r })),
			kpis: obj.kpis.map((k) => ({ kpi: k })),
			score: obj.score,
			comments: obj.comments ?? ""
		});
	}

	return Object.values(groups).map((group) => ({
		...group,
		perspective: perspectives[group.perspective as PerspectiveType]
	}));
}
 
export function getCurrentFinancialYear() {
	const today = new Date();
	const year = getYear(today);
	const month = getMonth(today);
	return month >= 6 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
}
