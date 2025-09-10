import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";

export default async function UsageStatistics() {
	const [cards, organizations, employees, accounts] = await Promise.all([
		await prisma.bSC.count(),
		await prisma.organization.count(),
		await prisma.employee.count({}),
		await prisma.user.count()
	]);
	const array: { label: string; number: number }[] = [
		{ label: "BSCs", number: cards },
		{ label: "Entities", number: organizations },
		{ label: "Users", number: employees },
		{ label: "Logins", number: accounts }
	];
	return (
		<div className="max-w-5xl space-y-4 w-full mx-auto">
			<h1 className="text-xl text-center uppercase tracking-tight">So, it is a thing you can trust!</h1>
			<div className="flex gap-4 flex-wrap w-full *:flex-1">
				{array.map(({ label, number }, index) => (
					<Card key={index}>
						<CardHeader className="*:text-center">
							<CardTitle>{number}</CardTitle>
							<CardDescription>{label}</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>
		</div>
	);
}
