import prisma from "@/lib/prisma";
import { organizationContextDataInclude } from "@/lib/types";
import { bscSchema } from "@/lib/validations/bsc";

// We shall be getting the following
// NDP programmes for a supervisee
// There strategic objectives
// Performance objectives
export async function GET(req: Request) {
	try {
		const body = await req.json();
		const { supervisee, year, organizationId } = bscSchema.parse(body);
		const [organizationContext, position] = await Promise.all([
			await prisma.organizationContext.findFirst({
				where: { organizationId, financialYear: year },
				include: organizationContextDataInclude
			}),
			await prisma.position.findFirst({ where: { id: supervisee.id } })
		]);
		if (!organizationContext) {
			const errorMessage = "Failed to get Organization contexts for this year and organization";
			return Response.json(errorMessage, {
				status: 200,
				statusText: errorMessage
			});
		}
		if (!position) {
			const errorMessage =
				"The position you entered has missing info in the database, please cross check and submit again";
			return Response.json(errorMessage, {
				status: 200,
				statusText: errorMessage
			});
		}
		const { ndp } = organizationContext;
		if (!ndp) {
			const errorMessage = "Your organization is missing NDP for the given financial year";
			return Response.json(errorMessage, {
				status: 200,
				statusText: errorMessage
			});
		}
		const { osps: ndpOsps, programmes: ndpProgrammes } = ndp;
		const { duties, departmentalMandate } = position;
		return Response.json({ ndp, position }, { statusText: "Success", status: 200 });
	} catch (e) {
		console.error(e);
		const errorMessage = "There was a server error, please try again.";
		return Response.json(errorMessage, {
			status: 500,
			statusText: errorMessage
		});
	}
}
