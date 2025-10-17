"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude } from "@/lib/types";
import { scheduleOfDutySchema, ScheduleOfDutySchema } from "@/lib/validations/others";
import { verifySession } from "@/lib/verify-session";

export async function updateScheduleOfDuty({ bscId, input }: { input: ScheduleOfDutySchema; bscId: string }) {
	const { session } = await verifySession();
	if (!session) throw new Error("You must be logged in to perform this action.");
	const newInput = scheduleOfDutySchema.parse(input);

	return await prisma.bSC.update({
		where: { id: bscId },
		data: {
			scheduleOfDuty: {
				update: {
					data: {
						...newInput,
						resultAreas: newInput.resultAreas.map((r) => r.value),
						clients: newInput.clients.map((r) => r.value),
						reportingArrangements: newInput.reportingArrangements.map((r) => r.value),
						guidingDocuments: newInput.guidingDocuments.map((r) => r.value),
						outputActivities: {
							deleteMany: {},
							createMany: {
								data: input.outputActivities.map((p) => ({
									...p,
									activities: p.activities.map((a) => a.value)
								})),
								skipDuplicates: true
							}
						}
					}
				}
			}
		},

		include: bSCDataInclude
	});
}
