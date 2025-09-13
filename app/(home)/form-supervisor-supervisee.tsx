import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IndividualBSCSchema } from "@/lib/validations/bsc";
import { UseFormReturn } from "react-hook-form";

interface FormSupervisorSuperviseeProps {
	form: UseFormReturn<IndividualBSCSchema>;
}

export default function FormSupervisorSupervisee({ form }: FormSupervisorSuperviseeProps) {
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
						name="supervisee.jobTitle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Job title</FormLabel>
								<FormControl>
									<Input placeholder="Enter job title" {...field} />
								</FormControl>
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
						name="supervisor.jobTitle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Job title</FormLabel>
								<FormControl>
									<Input placeholder="Enter job title" {...field} />
								</FormControl>
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
