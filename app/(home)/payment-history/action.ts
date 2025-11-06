"use server";

import prisma from "@/lib/prisma";
import { paymentDataInclude } from "@/lib/types";
import { verifySession } from "@/lib/verify-session";
import { cache } from "react";

async function myPayments() {
	const { session } = await verifySession();
	const currentUser = session.user;
	if (!currentUser) throw Error("Unauthorized access");
	return await prisma.payment.findMany({
		where: { userId: currentUser.id },
		include: paymentDataInclude
	});
}

export const getMyPayments = cache(myPayments);
