"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude } from "@/lib/types";
import { PerformanceObjectiveArraySchema } from "@/lib/validations/bsc";
import { verifySession } from "@/lib/verify-session";

export async function updatePerformancePlan({
	bscId,
	input
}: {
	input: PerformanceObjectiveArraySchema;
	bscId: string;
}) {
	const { session } = await verifySession();
	if (!session) throw new Error("You must be logged in to perform this action.");

	return await prisma.bSC.update({
		where: { id: bscId },
		data: {
			performanceObjectives: {
				deleteMany: {},
				createMany: {
					data: input.performanceObjectives.map((p) => ({
						...p,
						actions: p.actions.map((a) => a.value),
						kpis: p.kpis.map((a) => a.value),
						expectedResults: p.expectedResults.map((a) => a.value)
					})),
					skipDuplicates: true
				}
			}
		},

		include: bSCDataInclude
	});
}
