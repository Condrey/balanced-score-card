"use server";

import prisma from "@/lib/prisma";
import {
  bSCDataInclude,
  organizationContextDataInclude,
  positionDataInclude,
} from "@/lib/types";
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

async function bscOrganizationContextPositionByIds({
  bscId,
  organizationId,
  positionId,
  year,
}: {
  bscId?: string;
  organizationId: string;
  positionId: string;
  year: string;
}) {
  const [bSc, position, organizationContext] = await Promise.all([
    await prisma.bSC.findFirst({
      where: { id: bscId || "" },
      include: bSCDataInclude,
    }),
    await prisma.position.findUnique({
      where: { id: positionId },
      include: positionDataInclude,
    }),
    await prisma.organizationContext.findFirst({
      where: { organizationId: organizationId, financialYear: year },
      include: organizationContextDataInclude,
    }),
  ]);
  return { bSc, position, organizationContext };
}
export const getBscOrganizationContextPositionByIds = cache(
  bscOrganizationContextPositionByIds
);
