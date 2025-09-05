"use server";

import prisma from "@/lib/prisma";
import { organizationDataInclude } from "@/lib/types";
import {
  organizationSchema,
  OrganizationSchema,
} from "@/lib/validations/others";
import { cache } from "react";

async function allOrganizations() {
  return await prisma.organization.findMany({
    include: organizationDataInclude,
  });
}
export const getAllOrganizations = cache(allOrganizations);

export async function upsertOrganization(input: OrganizationSchema) {
  // TODO: perform auth
  const { id, name, structure, voteName } = organizationSchema.parse(input);
  return await prisma.organization.upsert({
    where: { id },
    create: {
      name,
      structure,
      voteName,
    },
    update: {
      name,
      structure,
      voteName,
    },
    include: organizationDataInclude,
  });
}

export async function deleteOrganization(id: string) {
  // TODO: perform auth
  return await prisma.organization.delete({
    where: { id },
    include: organizationDataInclude,
  });
}
