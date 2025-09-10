import EmptyContainer from "@/components/query-containers/empty-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganizationContextData } from "@/lib/types";
import { Edit3Icon, PlusIcon, Trash2Icon } from "lucide-react";
import ButtonAddEditCoreValue from "./(core-values)/button-add-edit-core-value";
import CoreValuesContainer from "./(core-values)/core-values-container";
import ButtonAddEditNdp from "./(ndp)/button-add-edit-ndp";
import ListOfNDPs from "./(ndp)/list-of-ndps";
import ButtonAddEditOrganizationContext from "./button-add-edit-organization-context";
import ButtonDeleteOrganizationContext from "./button-delete-organization-context";

interface OrganizationContextsProps {
	contexts: OrganizationContextData[];
}
export default function OrganizationContexts({ contexts }: OrganizationContextsProps) {
	return (
		<Tabs defaultValue={contexts[0].financialYear}>
			<TabsList className="my-4 flex w-full justify-start gap-2">
				<ButtonAddEditOrganizationContext size="sm" organizationId={contexts[0].organizationId!}>
					<PlusIcon className="size-4" />
					FY
				</ButtonAddEditOrganizationContext>
				{contexts.map((ctx) => (
					<TabsTrigger key={ctx.id} value={ctx.financialYear}>
						{ctx.financialYear}
					</TabsTrigger>
				))}
			</TabsList>
			{contexts.map((ctx) => {
				const { mandate, financialYear, vision, mission, goal, ndp, id, organizationId, coreValue } = ctx;
				const ctxValues = [
					{ label: "Financial Year", value: financialYear },
					{ label: "Mandate", value: mandate },
					{ label: "Vision", value: vision },
					{ label: "Mission", value: mission },
					{ label: "goal", value: goal }
				];
				return (
					<TabsContent key={id} value={financialYear} className="space-y-4 *:mx-auto *:w-full *:max-w-5xl">
						<Card className="">
							<CardHeader className="flex w-full flex-row items-center justify-between gap-3">
								<div>
									<CardTitle>BSC STRATEGIC ELEMENTS</CardTitle>
									<CardDescription>Mandate, vision, mission, goal, e.t.c</CardDescription>
								</div>
								<div className="flex items-center gap-2">
									<ButtonAddEditOrganizationContext organizationId={organizationId!} context={ctx} size="icon">
										<Edit3Icon />
									</ButtonAddEditOrganizationContext>
									<ButtonDeleteOrganizationContext organizationContext={ctx} size="icon" variant={"destructive"}>
										<Trash2Icon />
									</ButtonDeleteOrganizationContext>
								</div>
							</CardHeader>
							<CardContent className="flex flex-col gap-3">
								{ctxValues.map(({ label, value }) => (
									<p key={label} className="line-clamp-4 text-ellipsis hyphens-auto text-justify md:line-clamp-2">
										<span className="uppercase text-muted-foreground">{label}: </span> {value}
									</p>
								))}
							</CardContent>
						</Card>
						{/* Core value  */}
						{!coreValue ? (
							<EmptyContainer
								message={
									"It is evident that you do not have a set of core values submitted for this particular financial year. Please add"
								}
								className="border border-destructive p-3 text-destructive"
							>
								<ButtonAddEditCoreValue context={ctx} variant="secondary">
									Create the Core values
								</ButtonAddEditCoreValue>
							</EmptyContainer>
						) : (
							<CoreValuesContainer organizationContext={ctx} coreValue={coreValue} />
						)}
						{/* National development programmes  */}
						{!ndp ? (
							<EmptyContainer
								message={"Please note that you have not added any NDP strategy and objectives. Please add"}
								className="border border-destructive p-3 text-destructive"
							>
								<ButtonAddEditNdp context={ctx} variant="secondary">
									Create the NDP
								</ButtonAddEditNdp>
							</EmptyContainer>
						) : (
							<ListOfNDPs ndp={ndp} context={ctx} />
						)}
					</TabsContent>
				);
			})}
		</Tabs>
	);
}
