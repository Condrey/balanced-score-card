import { PerspectiveType } from "@prisma/client";

export const allPerspectives = Object.values(PerspectiveType);
export const perspectives: Record<PerspectiveType, string> = {
	STAKEHOLDERS_CLIENTS: "STAKEHOLDERS/CLIENTS",
	FINANCIAL_STEWARDSHIP: "FINANCIAL STEWARDSHIP",
	INTERNAL_PROCESSES: "INTERNAL PROCESSES",
	MDA_LG_CAPACITY: "MDA/LG CAPACITY"
};
