"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude } from "@/lib/types";
import { verifySession } from "@/lib/verify-session";
import { cache } from "react";

async function allLoggedInUserBSCs() {
	const { session } = await verifySession();
	return await prisma.bSC.findMany({
		where: { userId: session.user.id },
		include: bSCDataInclude,
		orderBy: { createdAt: "desc" }
	});
}
export const getAllLoggedInUserBSCs = cache(allLoggedInUserBSCs);
