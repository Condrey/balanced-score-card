"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude } from "@/lib/types";
import { paymentSchema, PaymentSchema } from "@/lib/validations/others";
import { verifySession } from "@/lib/verify-session";
import { cache } from "react";

async function allBSCs() {
	return await prisma.bSC.findMany({
		include: bSCDataInclude,
		orderBy: { createdAt: "desc" }
	});
}
export const getAllBSCs = cache(allBSCs);

export async function upsertBSCPayment(input: PaymentSchema) {
	const { session } = await verifySession();
	if (!session) throw Error("Unauthorized");
	const { id, amount, bSCId, balance, userId } = paymentSchema.parse(input);
	await prisma.payment.upsert({
		where: { id },
		create: { bSCId, amount, balance, userId },
		update: { bSCId, amount, balance, userId }
	});
}
