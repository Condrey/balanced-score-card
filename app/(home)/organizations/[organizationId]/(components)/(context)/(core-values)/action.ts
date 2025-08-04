"use server";

import prisma from "@/lib/prisma";
import { organizationContextDataInclude } from "@/lib/types";
import { coreValuesSchema, CoreValuesSchema } from "@/lib/validations/bsc";

export async function upsertCoreValues({
  input,
  organizationContextId,
}: {
  input: CoreValuesSchema;
  organizationContextId: string;
}) {
  // TODO: perform auth
  const { id, acronym, values } = coreValuesSchema.parse(input);

  return await prisma.organizationContext.update({
    where: { id: organizationContextId },
    data: {
      coreValue: {
        upsert: {
          where: { id: id || undefined },
          create: {
            acronym,
            values: { createMany: { data: values, skipDuplicates: true } },
          },
          update: {
            acronym,
            values: { createMany: { data: values, skipDuplicates: true } },
          },
        },
      },
      behavioralAttributes: {
        createMany: {
          data: values.map((v) => ({
            attribute: v.value,
            percentage: v.score,
          })),
          skipDuplicates: true,
        },
      },
    },
    include: organizationContextDataInclude,
  });
}

export async function deleteCoreValues(id: string) {
  // TODO: perform auth
  return await prisma.coreValue.delete({
    where: { id },
  });
}
