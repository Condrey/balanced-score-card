import EmptyContainer from "@/components/query-containers/empty-container";
import prisma from "@/lib/prisma";
import { bSCDataInclude } from "@/lib/types";
import { getCurrentFinancialYear } from "@/lib/utils";
import { verifySession } from "@/lib/verify-session";
import { Loader2Icon } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import { getOrganizationContext } from "./action";
import BscSamples from "./bsc-samples";
import PageContainer from "./page-container";

export const metadata: Metadata = {
	title: "Welcome to BSC Generator"
};
export default function Page() {
	return (
		<PageContainer heading={[{ label: "Home", url: "/" }]}>
			<Suspense
				fallback={
					<EmptyContainer message={"Fetching dashboard values"}>
						<Loader2Icon className="animate-spin" />
					</EmptyContainer>
				}
			>
				<PageContent />
			</Suspense>
		</PageContainer>
	);
}

async function PageContent() {
	const { session } = await verifySession();
	const user = session.user;
	const year = getCurrentFinancialYear();

	const [balancedScoreCards, paymentHistories, organizationContext] = await Promise.all([
		await prisma.bSC.findMany({ where: { userId: user.id }, take: 5, include: bSCDataInclude }),
		await prisma.payment.findMany({ where: { userId: user.id }, take: 5 }),
		await getOrganizationContext({ organizationId: user.organizationId!, year })
	]);
	return (
		<>
			{/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
			<BscSamples balancedScoreCards={balancedScoreCards} organizationContext={organizationContext!} />
		</>
	);
}
