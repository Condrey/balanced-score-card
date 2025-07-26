"use server";

import prisma from "@/lib/prisma";
import {
  ndpDataInclude,
  organizationContextDataInclude,
  organizationDataInclude,
  ospDataInclude,
} from "@/lib/types";
import {
  NdpSchema,
  ndpSchema,
  organizationContextSchema,
  OrganizationContextSchema,
  ospSchema,
  OspSchema,
} from "@/lib/validations/others";
import { cache } from "react";

async function organizationById(id: string) {
  return await prisma.organization.findUnique({
    where: { id },
    include: organizationDataInclude,
  });
}
export const getOrganizationById = cache(organizationById);

export async function upsertOrganizationContext(
  input: OrganizationContextSchema,
) {
  // TODO: perform auth
  const { id, financialYear, mandate, vision, mission, goal, organizationId } =
    organizationContextSchema.parse(input);
  return await prisma.organizationContext.upsert({
    where: { id },
    create: {
      financialYear,
      mandate,
      vision,
      mission,
      goal,
      organizationId,
    },
    update: {
      financialYear,
      mandate,
      vision,
      mission,
      goal,
      organizationId,
    },
    include: organizationContextDataInclude,
  });
}

export async function deleteOrganizationContext(id: string) {
  // TODO: perform auth
  return await prisma.organizationContext.delete({
    where: { id },
    include: organizationContextDataInclude,
  });
}

export async function upsertNdp({
  input,
  organizationContextId,
}: {
  input: NdpSchema;
  organizationContextId: string;
}) {
  // TODO: perform auth
  const { id, programmes, version } = ndpSchema.parse(input);
  const formattedProgrammes = programmes
    .map((p) => p.value)
    .filter(Boolean) as string[];
  return await prisma.organizationContext.update({
    where: { id: organizationContextId },
    data: {
      ndp: {
        upsert: {
          where: { id: id || undefined },
          create: { version, programmes: formattedProgrammes },
          update: { version, programmes: formattedProgrammes },
        },
      },
    },
    include: organizationContextDataInclude,
  });
}

export async function deleteNdp(id: string) {
  // TODO: perform auth
  return await prisma.ndp.delete({
    where: { id },
    include: ndpDataInclude,
  });
}

export async function upsertOsp(input: OspSchema) {
  // TODO: perform auth
  const { id, ndpId, programmes, strategicObjective, strategies } =
    ospSchema.parse(input);
  const formattedProgrammes = programmes
    .map((p) => p.value)
    .filter(Boolean) as string[];
  const formattedStrategies = strategies
    .map((p) => p.value)
    .filter(Boolean) as string[];
  return await prisma.ndp.update({
    where: { id: ndpId },
    data: {
      osps: {
        upsert: {
          where: { id: id || undefined },
          create: {
            strategicObjective,
            strategies: formattedStrategies,
            programmes: formattedProgrammes,
          },
          update: {
            strategicObjective,
            strategies: formattedStrategies,
            programmes: formattedProgrammes,
          },
        },
      },
    },
  });
}

export async function deleteOsp(id: string) {
  // TODO: perform auth
  return await prisma.osp.delete({
    where: { id },
    include: ospDataInclude,
  });
}
