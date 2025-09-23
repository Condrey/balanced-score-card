import prisma from "@/lib/prisma";
import { organizationContextDataInclude } from "@/lib/types";
import { organizationContextPropsSchema } from "@/lib/validations/others";
import { generateAiMandate, generateAiNdps, generateAiUserClients, generateAiUserObjects } from "./ai-values";

// We shall be getting the following
// NDP programmes for a supervisee
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { financialYear, organizationId, position: positionId } = organizationContextPropsSchema.parse(body);
		const officer = await prisma.position.findFirst({
			where: { id: positionId }
		});
		const organizationContext = await prisma.organizationContext.findFirst({
			where: { organizationId, financialYear },
			include: organizationContextDataInclude
		});

		if (!officer) {
			const errorMessage = "Failed to get officer for the given position";
			console.error(errorMessage);
			return Response.json(errorMessage, {
				status: 200,
				statusText: errorMessage
			});
		}

		if (!organizationContext) {
			const errorMessage = `Failed to get Organization contexts for this FY${financialYear} and organization`;
			console.error(errorMessage);
			return Response.json(errorMessage, {
				status: 200,
				statusText: errorMessage
			});
		}

		const { ndp } = organizationContext;
		if (!ndp) {
			const errorMessage = "Your organization is missing NDP for the given financial year";
			console.error(errorMessage);
			return Response.json(errorMessage, {
				status: 200,
				statusText: errorMessage
			});
		}
		const { osps: ndpOsps, programmes: ndpProgrammes } = ndp;
		//Ai part

		const [ndps, myClients, mandate] = await Promise.all([
			await generateAiNdps(officer, ndpProgrammes),
			await generateAiUserClients(officer.jobTitle),
			await generateAiMandate(officer.jobTitle)
		]);
		const userObjectives = await generateAiUserObjects({ ndp, targetProgrammes: ndps });

		return Response.json(
			{ ndps, userObjectives, organizationContext, mandate, clients: myClients },
			{ statusText: "Success", status: 200 }
		);
	} catch (e) {
		console.error(e);
		const errorMessage = "There was a server error, please try again.";
		return Response.json(errorMessage, {
			status: 500,
			statusText: errorMessage
		});
	}
}
