import prisma from "@/lib/prisma";
import { positionDataInclude } from "@/lib/types";
import { getAllOrganizations } from "../organizations/actions";
import MainForm from "./main-form";

interface PageProps {}
export default async function Page() {
	const [positions, organizations] = await Promise.all([
		await prisma.position.findMany({
			include: positionDataInclude,
			orderBy: { createdAt: "desc" }
		}),
		await getAllOrganizations()
	]);

	return (
		<div className="max-w-11/12 mx-auto space-y-12 w-full">
			<h1 className="text-2xl font-semibold uppercase">Batch requests</h1>
			<MainForm positions={positions} organizations={organizations} />
		</div>
	);
}
