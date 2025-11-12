import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { positionDataInclude } from "@/lib/types";
import { verifySession } from "@/lib/verify-session";
import { Metadata } from "next";
import PageContainer from "../page-container";
import FormAddBalancedScoreCard from "./form-add-balanced-score-card";

export const metadata: Metadata = {
	title: "Add Balanced Score Card",
	description: "Create a new Balanced Score Card "
};

export default async function Page() {
	const { session } = await verifySession();
	const positions = await prisma.position.findMany({ include: positionDataInclude });
	return (
		<PageContainer
			heading={[{ label: "Home", url: "/" }, { label: "Add Balanced Score Card" }]}
			className="max-w-5xl w-full mx-auto"
		>
			<CardHeader className="bg-background px-0">
				<CardTitle className="uppercase">Create your new Balanced Score Card</CardTitle>
			</CardHeader>
			<CardContent className="px-0">
				<FormAddBalancedScoreCard user={session.user} positions={positions} />
			</CardContent>
		</PageContainer>
	);
}
