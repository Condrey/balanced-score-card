"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude } from "@/lib/types";
import { cache } from "react";

async function allBSCs() {
  return await prisma.bSC.findMany({
    include: bSCDataInclude,
    orderBy: { createdAt: "desc" },
  });
}
export const getAllBSCs = cache(allBSCs);
