"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude, positionDataInclude } from "@/lib/types";
import { EmployeeSchema, individualBSCSchema, IndividualBSCSchema } from "@/lib/validations/bsc";
import { verifySession } from "@/lib/verify-session";
import { cache } from "react";

export async function updateParticulars({ bscId, input }: { input: IndividualBSCSchema; bscId: string }) {
	const { session } = await verifySession();
	if (!session) throw new Error("You must be logged in to perform this action.");
	const { supervisee, supervisor, year } = individualBSCSchema.parse(input);
	const sanitizedSupervisor = {
		employeeNumber: supervisor.employeeNumber,
		jobTitle: supervisor.jobTitle,
		name: supervisor.name,
		salaryScale: supervisor.salaryScale
	} satisfies EmployeeSchema;

	const sanitizedSupervisee = {
		employeeNumber: supervisee.employeeNumber,
		jobTitle: supervisee.jobTitle,
		name: supervisee.name,
		salaryScale: supervisee.salaryScale
	} satisfies EmployeeSchema;
	return await prisma.bSC.update({
		where: { id: bscId },
		data: {
			supervisor: {
				// connectOrCreate: {
				// 	// TODO: Return back to original
				// 	where: { id: supervisor.id  },
				create: sanitizedSupervisor
				// }
			},
			supervisee: {
				// connectOrCreate: {
				// 	where: { id: supervisee.id },
				create: { ...sanitizedSupervisee, reportsToId: supervisor.id }
				// }
			}
		},

		include: bSCDataInclude
	});
}

async function positions() {
	return await prisma.position.findMany({ include: positionDataInclude });
}
export const getPositions = cache(positions);
