import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PositionData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { IndividualBSCSchema } from "@/lib/validations/bsc";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface FormSupervisorSuperviseeProps {
	form: UseFormReturn<IndividualBSCSchema>;
	positions: PositionData[];
}

export default function FormSupervisorSupervisee({ form, positions }: FormSupervisorSuperviseeProps) {
	const supervisee = form.watch("supervisee");
	const supervisor = form.watch("supervisor");
	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Supervisee Particulars</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormField
						control={form.control}
						name="supervisee.employeeNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Employee Number</FormLabel>
								<FormControl>
									<Input placeholder="Enter employee number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="supervisee.name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full name</FormLabel>
								<FormControl>
									<Input placeholder="Enter full name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="supervisee.id"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Job title</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												role="combobox"
												className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
											>
												{field.value
													? positions.find((_position) => _position.id === field.value)?.jobTitle
													: "Select position"}
												<ChevronsUpDownIcon className="opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-full p-0">
										<Command>
											<CommandInput placeholder="Search positions..." className="h-9" />
											<CommandList>
												<CommandEmpty>No position found. Please consult the admin to add position.</CommandEmpty>
												<CommandGroup>
													{positions?.map((_position) => (
														<CommandItem
															value={`${_position.jobTitle} (${_position.salaryScale})`}
															key={_position.id}
															onSelect={() => {
																form.setValue("supervisee", {
																	...supervisee,
																	id: _position.id,
																	jobTitle: _position.jobTitle,
																	salaryScale: _position.salaryScale
																});
																form.setValue("supervisor", {
																	...supervisor,
																	id: _position.reportsToId || supervisor.id,
																	jobTitle: _position.reportsTo?.jobTitle || supervisor.jobTitle,
																	salaryScale: _position.reportsTo?.salaryScale || supervisor.salaryScale
																});
															}}
														>
															{_position.jobTitle}{" "}
															<span className="inline align-baseline text-xs text-muted-foreground">
																({_position.salaryScale})
															</span>
															<CheckIcon
																className={cn("ml-auto", _position.id === field.value ? "opacity-100" : "opacity-0")}
															/>
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="supervisee.salaryScale"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Salary Scale</FormLabel>
								<FormControl>
									<Input placeholder="Enter salary Scale" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Supervisor Particulars</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormField
						control={form.control}
						name="supervisor.employeeNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Employee Number</FormLabel>
								<FormControl>
									<Input placeholder="Enter employee number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="supervisor.name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full name</FormLabel>
								<FormControl>
									<Input placeholder="Enter full name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="supervisor.id"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Job title</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												role="combobox"
												className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
											>
												{field.value
													? positions.find((_position) => _position.id === field.value)?.jobTitle
													: "Select position"}
												<ChevronsUpDownIcon className="opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-full p-0">
										<Command>
											<CommandInput placeholder="Search positions..." className="h-9" />
											<CommandList>
												<CommandEmpty>No position found. Please consult the admin to add position.</CommandEmpty>
												<CommandGroup>
													{positions?.map((_position) => (
														<CommandItem
															value={`${_position.jobTitle} (${_position.salaryScale})`}
															key={_position.id}
															onSelect={() => {
																form.setValue("supervisor", {
																	...supervisor,
																	id: _position.id,
																	jobTitle: _position.jobTitle,
																	salaryScale: _position.salaryScale
																});
															}}
														>
															{_position.jobTitle}{" "}
															<span className="inline align-baseline text-xs text-muted-foreground">
																({_position.salaryScale})
															</span>
															<CheckIcon
																className={cn("ml-auto", _position.id === field.value ? "opacity-100" : "opacity-0")}
															/>
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="supervisor.salaryScale"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Salary Scale</FormLabel>
								<FormControl>
									<Input placeholder="Enter salary Scale" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
