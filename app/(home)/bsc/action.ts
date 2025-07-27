"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude } from "@/lib/types";
import { BSCFormData, bscSchema } from "@/lib/validations/bsc";
import { cache } from "react";

async function allBSCs() {
  return await prisma.bSC.findMany({
    include: bSCDataInclude,
    orderBy: { createdAt: "desc" },
  });
}
export const getAllBSCs = cache(allBSCs);

export async function upsertBSC(input: BSCFormData) {
  // TODO: perform auth
  const {
    id,
    behavioralAttributes,
    coreValues,
    performanceObjectives,
    strategicElements: {
      departmentalMandate,
      goal,
      mandate,
      mission,
      ndpProgrammes,
      strategicObjectives,
      vision,
    },
    supervisee,
    supervisor,
    year,
  } = bscSchema.parse(input);
  // const formattedDuties = duties
  //   .map((d) => d.value)
  //   .filter(Boolean) as string[];
  return await prisma.bSC.upsert({
    where: { id },
    create: {
      departmentalMandate,
      goal,
      mandate,
      mission,
      ndpProgrammes,
      strategicObjectives,
      vision,
      year,
      supervisor: {
        connectOrCreate: {
          where: { employeeNumber: supervisor.employeeNumber },
          create: supervisor,
        },
      },
      supervisee: {
        connectOrCreate: {
          where: { employeeNumber: supervisee.employeeNumber },
          create: supervisee,
        },
      },
      coreValues: {
        createMany: { data: coreValues, skipDuplicates: true },
      },
      behavioralAttributes: {
        createMany: { data: behavioralAttributes, skipDuplicates: true },
      },
      performanceObjectives: {
        createMany: { data: performanceObjectives, skipDuplicates: true },
      },
    },
    update: {
      departmentalMandate,
      goal,
      mandate,
      mission,
      ndpProgrammes,
      strategicObjectives,
      vision,
      year,
      supervisor: {
        connectOrCreate: {
          where: { employeeNumber: supervisor.employeeNumber },
          create: supervisor,
        },
      },
      supervisee: {
        connectOrCreate: {
          where: { employeeNumber: supervisee.employeeNumber },
          create: supervisee,
        },
      },
      coreValues: {
        createMany: { data: coreValues, skipDuplicates: true },
      },
      behavioralAttributes: {
        createMany: { data: behavioralAttributes, skipDuplicates: true },
      },
      performanceObjectives: {
        createMany: { data: performanceObjectives, skipDuplicates: true },
      },
    },
    include: bSCDataInclude,
  });
}

export async function deleteBSC(id: string) {
  // TODO: perform auth
  return await prisma.bSC.delete({
    where: { id },
    include: bSCDataInclude,
  });
}
