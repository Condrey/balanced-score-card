"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import { buttonVariants } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentData } from "@/lib/types";
import { cn, formatDate, formatLocalCurrency } from "@/lib/utils";
import { CircleDollarSignIcon, HistoryIcon, MoveRightIcon } from "lucide-react";
import Link from "next/link";
import ButtonAddEditPayment from "../admin/bsc/button-add-edit-payment";

interface PaymentSamplesProps {
	payments: PaymentData[];
	userId: string;
}

export default function PaymentSamples({ payments, userId }: PaymentSamplesProps) {
	return (
		<div className="space-y-4    max-w-5xl w-full mx-auto">
			<CardHeader className="bg-card flex-row flex-wrap justify-between items-center">
				<CardTitle className=" capitalize">Recent Payments</CardTitle>
				<ButtonAddEditPayment userId={userId}>New Payment</ButtonAddEditPayment>
			</CardHeader>
			<CardContent>
				{!payments.length ? (
					<EmptyContainer
						message={"You have not made any payment yet. Please make one to view here."}
						className="min-h-fit"
					>
						<ButtonAddEditPayment userId={userId}>Add one</ButtonAddEditPayment>
					</EmptyContainer>
				) : (
					<div className="space-y-4">
						<div className="flex gap-3 items-center flex-wrap">
							{/* <ButtonAddPAYMENT organizationContext={organizationContext}>New PAYMENT</ButtonAddPAYMENT> */}
							<div className=" w-full  ">
								{payments.map((payment) => (
									<PaymentFile payment={payment} key={payment.id} />
								))}
							</div>
						</div>
						{/* <pre>{JSON.stringify(groupByPerspective(payment.performanceObjectives), null, 2)}</pre> */}
						{payments.length > 2 && (
							<div className="ms-auto w-full max-w-fit">
								<Link href={"/payment-history"} className={cn(buttonVariants({ variant: "secondary" }))}>
									View all payments
									<MoveRightIcon />
								</Link>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</div>
	);
}

function PaymentFile({ payment }: { payment: PaymentData }) {
	const { amount, balance, bsc, user, createdAt } = payment;

	return (
		<div className="border px-3 py-1.5 flex flex-col gap-3 sm:flex-row justify-between even:bg-muted">
			<div>
				<div className="flex gap-2 flex-wrap items-center ">
					<CircleDollarSignIcon className={cn("size-16 text-muted fill-muted-foreground")} strokeWidth={0.9} />
					<div>
						<h2 className="text-xl oldstyle-nums tabular-nums slashed-zero">{formatLocalCurrency(amount)}</h2>
						<h2 className="text-xl oldstyle-nums tabular-nums slashed-zero">
							{balance <= 0 ? (
								<span className="text-muted-foreground">No balance</span>
							) : (
								<>
									<strong>Bal</strong> {formatLocalCurrency(balance)}
								</>
							)}
						</h2>
					</div>
				</div>
			</div>
			<div className=" flex-col hidden sm:flex justify-center">
				<span className="text-muted-foreground text-xs">Made by: {user.name}</span>
				<span className="text-muted-foreground text-sm">For BSC: FY{bsc.year}</span>
			</div>
			<div className="w-full max-w-fit ms-auto sm:ms-0">
				<CardDescription>
					<HistoryIcon className="inline-flex size-4 mr-2" />
					{formatDate(createdAt)}
				</CardDescription>
			</div>
		</div>
	);
}
