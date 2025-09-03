import { PerformanceObjective, PerspectiveType } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { perspectives } from "./constants";
import { PerspectiveGroup } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupByPerspective(
  performanceObjectives: PerformanceObjective[],
) {
  const groups: Record<string, PerspectiveGroup> = {};

  for (const obj of performanceObjectives) {
    if (!groups[obj.perspective]) {
      groups[obj.perspective] = {
        perspective: obj.perspective,
        percentage: 0, // start at 0 and sum later
        objectives: [],
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
      comments: obj.comments ?? "",
    });
  }

  return Object.values(groups).map((group) => ({
    ...group,
    perspective: perspectives[group.perspective as PerspectiveType],
  }));
}
