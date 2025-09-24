import prisma from "@/lib/prisma";
import { positionDataInclude } from "@/lib/types";
import { sdRequestSchema } from "@/lib/validations/others";
import { generateScheduleOfDuty } from "./ai-values";

// We shall be getting the following
// NDP programmes for a supervisee
export async function POST(req: Request) {
	try {

		const body = await req.json();

		const { positionId, location } = sdRequestSchema.parse(body);
		const officer = await prisma.position.findFirst({
			where: { id: positionId },
			include: positionDataInclude
		});

		if (!officer) {
			const errorMessage = "Failed to get officer for the given position";
			console.error(errorMessage);
			return Response.json(errorMessage, {
				status: 200,
				statusText: errorMessage
			});
		}

		const response = await generateScheduleOfDuty({ officer, location });

		return Response.json(response, { statusText: "Success", status: 200 });
	} catch (e) {
		console.error(e);
		const errorMessage = "There was a server error, please try again.";
		return Response.json(errorMessage, {
			status: 500,
			statusText: errorMessage
		});
	}
}
