"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude, positionDataInclude } from "@/lib/types";
import { individualBSCSchema, IndividualBSCSchema } from "@/lib/validations/bsc";
import { verifySession } from "@/lib/verify-session";
import { cache } from "react";

export async function updateParticulars({ bscId, input }: { input: IndividualBSCSchema; bscId: string }) {
	const { session } = await verifySession();
	if (!session) throw new Error("You must be logged in to perform this action.");
	const { supervisee, supervisor, year } = individualBSCSchema.parse(input);
	return await prisma.bSC.update({
		where: { id: bscId },
		data: {
			supervisor: {
				connectOrCreate: {
					// TODO: Return back to original
					where: { id: supervisor.id + "2" },
					create: supervisor
				}
			},
			supervisee: {
				connectOrCreate: {
					where: { id: supervisee.id },
					create: { ...supervisee, reportsToId: supervisor.id }
				}
			}
		},

		include: bSCDataInclude
	});
}

async function positions() {
	return await prisma.position.findMany({ include: positionDataInclude });
}
export const getPositions = cache(positions);
