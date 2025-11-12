import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { verifySession } from "@/lib/verify-session";
import { Metadata } from "next";
import { Suspense } from "react";
import PageContainer from "../page-container";
import { getAllLoggedInUserBSCs } from "./action";
import ListOfLoggedInUserBSCs from "./list-of-logged-in-user-bscs";

export const metadata: Metadata = {
	title: "Balanced Score Cards"
};
export default function Page() {
	return (
		<PageContainer heading={[{ label: "Balanced Score Cards" }]}>
			<Suspense fallback={<DataTableLoadingSkeleton />}>
				<Content />
			</Suspense>{" "}
		</PageContainer>
	);
}

async function Content() {
	const { session } = await verifySession();
	const bSCs = await getAllLoggedInUserBSCs();
	return (
		<div className="w-full max-w-fit mx-auto">
			<ListOfLoggedInUserBSCs bSCs={bSCs} userId={session.user.id} />
		</div>
	);
}
