"use server";

import prisma from "@/lib/prisma";
import { positionDataInclude } from "@/lib/types";
import { cache } from "react";

async function positionById(id: string) {
	return await prisma.position.findUnique({
		where: { id },
		include: positionDataInclude
	});
}
export const getPositionById = cache(positionById);
