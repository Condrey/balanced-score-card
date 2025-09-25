import { Prisma } from "@prisma/client";

export const positionDataInclude = {
	reportsTo: true,
	responsibleFor: true
} satisfies Prisma.PositionInclude;
export type PositionData = Prisma.PositionGetPayload<{
	include: typeof positionDataInclude;
}>;

export const coreValueDataInclude = {
	values: true
} satisfies Prisma.CoreValueInclude;
export type CoreValueData = Prisma.CoreValueGetPayload<{
	include: typeof coreValueDataInclude;
}>;

export const bSCDataInclude = {
	supervisee: true,
	supervisor: true,
	behavioralAttributes: { orderBy: { createdAt: "asc" } },
	coreValues: { include: { values: true } },
	performanceObjectives: true,
	organization: true,
	user: true,
	payments: true,scheduleOfDuty:{include:{outputActivities:true}}
} satisfies Prisma.BSCInclude;
export type BSCData = Prisma.BSCGetPayload<{
	include: typeof bSCDataInclude;
}>;

export const ospDataInclude = {
	ndp: true
} satisfies Prisma.OspInclude;
export type OspData = Prisma.OspGetPayload<{
	include: typeof ospDataInclude;
}>;

export const ndpDataInclude = {
	osps: { include: ospDataInclude }
} satisfies Prisma.NdpInclude;
export type NdpData = Prisma.NdpGetPayload<{
	include: typeof ndpDataInclude;
}>;

export const behavioralAttributeDataInclude = {} satisfies Prisma.BehavioralAttributeInclude;
export type BehavioralAttributeData = Prisma.BehavioralAttributeGetPayload<{
	include: typeof behavioralAttributeDataInclude;
}>;

export const organizationContextDataInclude = {
	ndp: { include: ndpDataInclude },
	coreValue: { include: { values: true } },
	behavioralAttributes: { orderBy: { createdAt: "asc" } }
} satisfies Prisma.OrganizationContextInclude;
export type OrganizationContextData = Prisma.OrganizationContextGetPayload<{
	include: typeof organizationContextDataInclude;
}>;

export const organizationDataInclude = {
	organizationContexts: { include: organizationContextDataInclude }
} satisfies Prisma.OrganizationInclude;
export type OrganizationData = Prisma.OrganizationGetPayload<{
	include: typeof organizationDataInclude;
}>;

export const peerReviewDataInclude = {
	user: true
} satisfies Prisma.PeerReviewInclude;
export type PeerReviewData = Prisma.PeerReviewGetPayload<{
	include: typeof peerReviewDataInclude;
}>;

// Miscellaneous
export type PerspectiveGroup = {
	perspective: string;
	percentage: number; // can keep first or sum
	objectives: {
		objective: string;
		percentage: number;
		actions: { action: string }[];
		expectedResults: { result: string }[];
		kpis: { kpi: string }[];
		score: number;
		comments: string;
	}[];
};

export type NavItem = {
	url?: string;
	label: string;
};
