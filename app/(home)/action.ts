"use server";

import prisma from "@/lib/prisma";
import { organizationContextDataInclude } from "@/lib/types";
import { verifySession } from "@/lib/verify-session";
import { cache } from "react";

async function organizationContext({ year, organizationId }: { year: string; organizationId: string }) {
	return await prisma.organizationContext.findFirst({
		where: { financialYear: year, organizationId },
		include: organizationContextDataInclude
	});
}

export const getOrganizationContext = cache(organizationContext);

async function positionsAndOrganizations({
	positionId,
	organizationId
}: {
	positionId?: string;
	organizationId?: string;
}) {
	const [positions, organizations, position, organization] = await Promise.all([
		await prisma.position.findMany({ orderBy: { jobTitle: "asc" } }),
		await prisma.organization.findMany({ orderBy: { name: "asc" } }),
		await prisma.position.findFirst({ where: { id: positionId || "" } }),
		await prisma.organization.findFirst({ where: { id: organizationId } })
	]);
	return { positions, organizations, position, organization };
}
export const getPositionsAndOrganizations = cache(positionsAndOrganizations);

export default async function updateUserPositionAndOrganization({
	positionId,
	organizationId
}: {
	positionId: string;
	organizationId: string;
}) {
	const { session } = await verifySession();
	if (!session) throw Error("Unauthorized.!");
	await prisma.user.update({
		where: { id: session.user.id },
		data: {
			organizationId,
			positionId
		}
	});
}
