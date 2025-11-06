"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { NumberInput } from "@/components/number-input/number-input";
import ResponsiveDrawer from "@/components/responsive-drawer";
import LoadingButton from "@/components/ui/loading-button";
import { paymentSchema, PaymentSchema } from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import { Payment } from "@prisma/client";
import { useForm } from "react-hook-form";
import { usePaymentMutation } from "./mutation";

interface FormAddEditPaymentFormProps {
	payment?: Payment;
	bSCId?: string;
	userId: string;
	open: boolean;
	setOpen: (open: boolean) => void;
}
export default function FormAddEditPaymentForm({ payment, bSCId, userId, open, setOpen }: FormAddEditPaymentFormProps) {
	const { isPending, mutate } = usePaymentMutation();
	const form = useForm<PaymentSchema>({
		resolver: zodResolver(paymentSchema),
		defaultValues: {
			id: payment?.id || "",
			amount: payment?.amount,
			balance: payment?.balance || 0,
			bSCId: payment?.bSCId || bSCId,
			userId: payment?.userId || userId
		}
	});
	const handleSubmit = (input: PaymentSchema) =>
		mutate(input, {
			onSuccess: () => {
				setOpen(false);
			}
		});

	return (
		<ResponsiveDrawer open={open} setOpen={setOpen} title={`${payment ? "Update" : "Add"} payment`}>
			<Form {...form}>
				<pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Amount Paid</FormLabel>
								<FormControl>
									<NumberInput {...field} placeholder="Please input paid amount" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="balance"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Pending Balance</FormLabel>
								<FormControl>
									<NumberInput {...field} placeholder="Please input pending balance" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<LoadingButton loading={isPending} className="w-full">
						{payment ? "Update" : "Submit"}
					</LoadingButton>
				</form>
			</Form>
		</ResponsiveDrawer>
	);
}
