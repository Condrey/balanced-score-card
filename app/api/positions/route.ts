import prisma from "@/lib/prisma";
import { positionDataInclude } from "@/lib/types";

export async function GET(req: Request, res: Response) {
	const data = await prisma.position.findMany({ include: positionDataInclude });
	return Response.json(data, { status: 200, statusText: "success" });
}
