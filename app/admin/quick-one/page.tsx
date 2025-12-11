import { getAllOrganizations } from "../organizations/actions";
import { getAllPositions } from "../positions/action";
import MainForm from "./main-form";

interface PageProps {}
export default async function Page() {
	const [positions, organizations] = await Promise.all([await getAllPositions(), await getAllOrganizations()]);

	return (
		<div className="max-w-11/12 mx-auto space-y-12 w-full">
			<h1 className="text-2xl font-semibold uppercase">Batch requests</h1>
			<MainForm positions={positions} organizations={organizations} />
		</div>
	);
}
