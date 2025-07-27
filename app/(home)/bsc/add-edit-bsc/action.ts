"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude, positionDataInclude } from "@/lib/types";
import { cache } from "react";

async function positionsAndOrganizations({
  positionId,
  organizationId,
}: {
  positionId?: string;
  organizationId?: string;
}) {
  const [positions, organizations, position, organization] = await Promise.all([
    await prisma.position.findMany({ orderBy: { jobTitle: "asc" } }),
    await prisma.organization.findMany({ orderBy: { name: "asc" } }),
    await prisma.position.findUnique({ where: { id: positionId } }),
    await prisma.organization.findUnique({ where: { id: organizationId } }),
  ]);
  return { positions, organizations, position, organization };
}
export const getPositionsAndOrganizations = cache(positionsAndOrganizations);

async function bSCById(id?: string) {
  return await prisma.bSC.findFirst({
    where: { id: id || "" },
    include: bSCDataInclude,
  });
}
export const getBSCById = cache(bSCById);
