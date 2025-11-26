"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude } from "@/lib/types";
import { BSCFormData, bscSchema } from "@/lib/validations/bsc";

export async function upsertBSC(input: BSCFormData) {
	// TODO: perform auth
	const {
		id,
		organizationId,
		behavioralAttributes,
		coreValues,
		performanceObjectives,
		strategicElements: { departmentalMandate, goal, mandate, mission, ndpProgrammes, strategicObjectives, vision },
		supervisee,
		supervisor,
		year
	} = bscSchema.parse(input);

	return await prisma.bSC.create({
		data: {
			organization: { connect: { id: organizationId || "" } },
			departmentalMandate,
			goal,
			mandate,
			mission,
			ndpProgrammes: ndpProgrammes.map((n) => n.value),
			strategicObjectives: strategicObjectives.map((s) => s.value),
			vision,
			year,
			supervisor: {
				// connectOrCreate: {
				// 	where: { id: supervisor.id },
				// 	create: supervisor
				// }
				create: supervisor
			},
			supervisee: {
				// connectOrCreate: {
				// 	where: { id: supervisee.id },
				// 	create: { ...supervisee, reportsToId: supervisor.id }
				// }
				create: { ...supervisee, reportsToId: supervisor.id }
			},
			coreValues: {
				connectOrCreate: {
					where: { id: coreValues.id || "" },
					create: {
						acronym: coreValues.acronym,
						values: {
							createMany: { data: coreValues.values, skipDuplicates: true }
						}
					}
				}
			},
			behavioralAttributes: {
				createMany: { data: behavioralAttributes.map((bA) => ({ ...bA, id: undefined })), skipDuplicates: true }
			},
			performanceObjectives: {
				createMany: {
					data: performanceObjectives.map((p) => ({
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

export async function deleteBSC(id: string) {
	// TODO: perform auth
	return await prisma.bSC.delete({
		where: { id },
		include: bSCDataInclude
	});
}
