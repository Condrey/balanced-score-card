import prisma from "@/lib/prisma";
import { positionDataInclude } from "@/lib/types";
import { organizationContextPropsSchema } from "@/lib/validations/others";
import { generateAiPerformancePlan } from "./ai-values";

// We shall be getting the following
// NDP programmes for a supervisee
export async function POST(req: Request) {
	console.log("Requesting plan");
	try {
		const body = await req.json();
		const { position: superviseeId, behavioralAttributes } = organizationContextPropsSchema.parse(body);
		if (!superviseeId) {
			const errorMessage = "Please provide the position for the post.";
			return Response.json(errorMessage, {
				status: 200,
				statusText: errorMessage
			});
		}
		let position = await prisma.position.findFirst({
			where: { id: superviseeId },
			include: positionDataInclude
		});

		if (!position) {
			const employee = await prisma.employee.findUnique({ where: { id: superviseeId } });
			position = await prisma.position.findFirst({
				where: { jobTitle: { mode: "insensitive", equals: employee?.jobTitle } },
				include: positionDataInclude
			});
			if (!position) {
				const errorMessage = "Sorry, this position was not found, please cross-check and try again.";
				return Response.json(errorMessage, {
					status: 200,
					statusText: errorMessage
				});
			}
		}

		const { duties } = position;
		if (!duties) {
			const errorMessage = "This position is missing duties.";
			return Response.json(errorMessage, {
				status: 200,
				statusText: errorMessage
			});
		}

		//Ai part
		const response = await generateAiPerformancePlan({ position, duties, behavioralAttributes });
		return Response.json(response, { statusText: "Success", status: 200 });
	} catch (e) {
		console.error(e || "We failed to decode the error");
		const errorMessage = "There was a server error, please try again.";
		return Response.json(errorMessage, {
			status: 500,
			statusText: errorMessage
		});
	}
}
