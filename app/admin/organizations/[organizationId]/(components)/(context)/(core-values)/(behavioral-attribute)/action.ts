"use server";

import prisma from "@/lib/prisma";
import { organizationContextDataInclude } from "@/lib/types";
import { behavioralAttributeSchema, BehavioralAttributeSchema } from "@/lib/validations/bsc";

export async function upsertBehavioralAttribute({
	input,
	organizationContextId
}: {
	input: BehavioralAttributeSchema;
	organizationContextId: string;
}) {
	// TODO: perform auth
	const { id, attribute, description, percentage, score, commentsJustification } =
		behavioralAttributeSchema.parse(input);

	return await prisma.organizationContext.update({
		where: { id: organizationContextId },
		data: {
			behavioralAttributes: {
				upsert: {
					where: { id },
					create: {
						attribute,
						description,
						percentage,
						score,
						commentsJustification
					},
					update: {
						attribute,
						description,
						percentage,
						score,
						commentsJustification
					}
				}
			}
		},
		include: organizationContextDataInclude
	});
}

export async function deleteBehavioralAttribute(id: string) {
	// TODO: perform auth
	return await prisma.behavioralAttribute.delete({
		where: { id }
	});
}
