import EmptyContainer from "@/components/query-containers/empty-container";
import { verifySession } from "@/lib/verify-session";
import { Loader2Icon } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import PageContainer from "../page-container";
import { getMyPayments } from "./action";
import ListOfPayments from "./list-of-payments";

export const metadata: Metadata = {
	title: "Payment History"
};
export default function Page() {
	return (
		<PageContainer heading={[{ label: "Payment History" }]}>
			<Suspense
				fallback={
					<EmptyContainer message={"Fetching Payments"}>
						<Loader2Icon className="animate-spin" />
					</EmptyContainer>
				}
			>
				<PageSuspense />
			</Suspense>
		</PageContainer>
	);
}

async function PageSuspense() {
	const payments = await getMyPayments();
	const { session } = await verifySession();
	const currentUser = session.user;

	return (
		<div className="w-full max-w-5xl mx-auto">
			<ListOfPayments initialData={payments} userId={currentUser.id} />
		</div>
	);
}
