"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormItem } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { OrganizationData, PositionData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BatchIndividualBSCSchema, batchIndividualBSCSchema } from "@/lib/validations/bsc";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronsUpDown, FilesIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGenerateAiDataForBSC } from "./ai-generation";
import ButtonAddMoreStaffs from "./button-add-edit-more-staffs";
import TableOfInputs from "./table-of-inputs";

export default function MainForm({
	positions,
	organizations
}: {
	positions: PositionData[];
	organizations: OrganizationData[];
}) {
	const [organizationId, setOrganizationId] = useState<string | undefined>(organizations[0].id);
	const form = useForm<BatchIndividualBSCSchema>({
		resolver: zodResolver(batchIndividualBSCSchema),
		defaultValues: {
			individuals: []
		}
	});

	function handleSubmit(input: BatchIndividualBSCSchema) {
		input.individuals.map(async (staff, index) => {
			const position = positions.find((p) => p.jobTitle === staff.supervisee.jobTitle);
			await useGenerateAiDataForBSC({
				index,
				staff,
				organizationId: organizationId!,
				positionId: position?.id!,
				setMsg: (index, msg) => {
					form.setError(`individuals.${index}`, { message: msg });
				}
			});
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<div className="flex  gap-3">
					{/* organization  */}
					{!!organizations && organizations.length ? (
						<FormItem className="flex flex-col max-w-md me-auto w-full">
							<Popover modal={false}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										className={cn("w-full justify-between ", !organizationId && "text-muted-foreground")}
									>
										{organizationId
											? organizations.find((org) => org.id === organizationId)?.name
											: "Select organization"}
										<ChevronsUpDown className="opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandInput placeholder="Search organizations..." className="h-9" />
										<CommandList>
											<CommandEmpty>No organization found. Please consult the admin to add organization.</CommandEmpty>
											<CommandGroup>
												{organizations?.map((org) => (
													<CommandItem
														value={`${org.name} (${org.voteName})`}
														key={org.id}
														onSelect={() => {
															setOrganizationId(org.id);
														}}
													>
														{org.name}{" "}
														<span className="inline align-baseline text-xs text-muted-foreground">
															({org.voteName})
														</span>
														<CheckIcon
															className={cn("ml-auto", org.id === organizationId ? "opacity-100" : "opacity-0")}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</FormItem>
					) : (
						<EmptyContainer message="The database has no organizations. Please contact the admin for further guidance" />
					)}
					<ButtonAddMoreStaffs thisForm={form} positions={positions} variant={"secondary"}>
						<PlusIcon />
						Add
					</ButtonAddMoreStaffs>
					<Button type="submit">
						<FilesIcon /> Submit Batch
					</Button>
				</div>
				<TableOfInputs form={form} positions={positions} />
			</form>
		</Form>
	);
}
