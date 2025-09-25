"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude, organizationContextDataInclude } from "@/lib/types";
import { BSCFormData, bscSchema } from "@/lib/validations/bsc";
import { verifySession } from "@/lib/verify-session";

export async function getOrganizationContext(organizationId: string, financialYear: string) {
	return await prisma.organizationContext.findFirst({
		where: { organizationId, financialYear },
		include: organizationContextDataInclude
	});
}

export async function upsertBSC(input: BSCFormData) {
	// TODO: perform auth
	const { session } = await verifySession();
	if (!session) throw new Error("You must be logged in to perform this action.");
	const {
		id,
		organizationId,
		behavioralAttributes,
		coreValues,
		performanceObjectives,
		strategicElements: { departmentalMandate, goal, mandate, mission, ndpProgrammes, strategicObjectives, vision },
		supervisee,
		supervisor,
		year,
		clients,
		scheduleOfDuty
	} = bscSchema.parse(input);
	const sanitizedSupervisor = {
		id: supervisor.id,
		employeeNumber: supervisor.employeeNumber,
		name: supervisor.name,
		jobTitle: supervisor.jobTitle,
		salaryScale: supervisor.salaryScale
	};
	const sanitizedSupervisee = {
		id: supervisee.id,
		employeeNumber: supervisee.employeeNumber,
		name: supervisee.name,
		jobTitle: supervisee.jobTitle,
		salaryScale: supervisee.salaryScale
	};

	return await prisma.bSC.create({
		data: {
			organization: { connect: { id: organizationId || "" } },
			clients: clients ? clients.map((c) => c.value) : [],
			user: {
				connectOrCreate: {
					where: { id: session.user.id },
					create: {
						id: session.user.id,
						name: session.user.name || "",
						email: session.user.email || ""
					}
				}
			},
			departmentalMandate,
			goal,
			mandate,
			mission,
			ndpProgrammes: ndpProgrammes.map((n) => n.value),
			strategicObjectives: strategicObjectives.map((s) => s.value),
			vision,
			year,
			supervisor: {
				connectOrCreate: {
					where: { id: supervisor.id },
					create: sanitizedSupervisor
				}
			},
			supervisee: {
				connectOrCreate: {
					where: { id: supervisee.id },
					create: sanitizedSupervisee
				}
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
			},
			scheduleOfDuty: {
				connectOrCreate: {
					where: { id: scheduleOfDuty?.id },
					create: {
						...scheduleOfDuty,
						positionId: scheduleOfDuty?.positionId!,
						jobTitle: scheduleOfDuty?.jobTitle!,
						location: scheduleOfDuty?.location!,
						jobSummary: scheduleOfDuty?.jobSummary!,
						resultAreas: scheduleOfDuty?.resultAreas.map((r) => r.value)!,
						clients: scheduleOfDuty?.clients.map((c) => c.value)!,
						reportingArrangements: scheduleOfDuty?.reportingArrangements.map((r) => r.value)!,
						guidingDocuments: scheduleOfDuty?.guidingDocuments.map((g) => g.value)!,
						outputActivities: {
							createMany: {
								data: scheduleOfDuty?.outputActivities?.map((oA) => ({
									output: oA.output,
									activities: oA.activities.map((a) => a.value)
								}))!
							}
						},
					}
				}
			}
		},

		include: bSCDataInclude
	});
}
