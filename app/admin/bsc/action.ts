"use server";

import { myPrivileges } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { bSCDataInclude } from "@/lib/types";
import { paymentSchema, PaymentSchema } from "@/lib/validations/others";
import { verifySession } from "@/lib/verify-session";
import { Role } from "@prisma/client";
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

export async function canUserAddExtraBsc(): Promise<boolean> {
	const { session } = await verifySession();
	const loggedInUser = session.user;
	const isAdmin = myPrivileges[loggedInUser.role || Role.USER].includes(Role.ADMIN);
	if (isAdmin) {
		return true;
	} else {
		const loggedInUserBSCs = await prisma.bSC.findMany({
			where: { userId: loggedInUser.id },
			include: { payments: true }
		});
		const allPayments = loggedInUserBSCs.map((u) => u.payments).flat();
		if (loggedInUserBSCs.length > 0 && !allPayments.length) {
			return false;
		} else {
			const balances = allPayments.map((p) => p.balance).reduce((acc, total) => acc + total, 0);
			const hasBalances = balances > 0;
			return !hasBalances;
		}
	}
}
