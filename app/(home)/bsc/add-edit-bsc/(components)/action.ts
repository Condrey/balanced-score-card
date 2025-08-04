"use server";

import prisma from "@/lib/prisma";
import { bSCDataInclude } from "@/lib/types";
import { BSCFormData, bscSchema } from "@/lib/validations/bsc";
import cuid from "cuid";

export async function upsertBSC(input: BSCFormData) {
  // TODO: perform auth
  const {
    id,
    organizationId,
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

  return await prisma.bSC.upsert({
    where: { id: id || cuid() },
    create: {
      organization: { connect: { id: organizationId } },
      departmentalMandate,
      goal,
      mandate,
      mission,
      ndpProgrammes: ndpProgrammes.map((n) => n.value),
      strategicObjectives: strategicObjectives.map((s) => s.value),
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
        connectOrCreate: {
          where: { id: coreValues.id },
          create: {
            acronym: coreValues.acronym,
            values: {
              createMany: { data: coreValues.values, skipDuplicates: true },
            },
          },
        },
      },
      behavioralAttributes: {
        createMany: { data: behavioralAttributes, skipDuplicates: true },
      },
      performanceObjectives: {
        createMany: {
          data: performanceObjectives.map((p) => ({
            ...p,
            actions: p.actions.map((a) => a.value),
            kpis: p.kpis.map((a) => a.value),
            expectedResults: p.expectedResults.map((a) => a.value),
          })),
          skipDuplicates: true,
        },
      },
    },
    update: {
      organization: { connect: { id: organizationId } },
      departmentalMandate,
      goal,
      mandate,
      mission,
      ndpProgrammes: ndpProgrammes.map((n) => n.value),
      strategicObjectives: strategicObjectives.map((s) => s.value),
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
        connectOrCreate: {
          where: { id: coreValues.id },
          create: {
            acronym: coreValues.acronym,
            values: {
              createMany: { data: coreValues.values, skipDuplicates: true },
            },
          },
        },
      },
      behavioralAttributes: {
        createMany: { data: behavioralAttributes, skipDuplicates: true },
      },
      performanceObjectives: {
        createMany: {
          data: performanceObjectives.map((p) => ({
            ...p,
            actions: p.actions.map((a) => a.value),
            kpis: p.kpis.map((a) => a.value),
            expectedResults: p.expectedResults.map((a) => a.value),
          })),
          skipDuplicates: true,
        },
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
