"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude } from "@/lib/types";
import { cache } from "react";

async function bSCById(id: string) {
	return await prisma.bSC.findUnique({
		where: { id },
		include: bSCDataInclude
	});
}

export const getBscById = cache(bSCById);
