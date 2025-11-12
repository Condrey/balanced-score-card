"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { organizationStructures } from "@/lib/enums";
import { BSCData } from "@/lib/types";
import { cn, formatLocalCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CheckIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

export const useBSCColumns: ColumnDef<BSCData>[] = [
	{
		id: "index",
		header({ column }) {
			return <DataTableColumnHeader column={column} title="S/N" />;
		},
		cell({ row }) {
			return <span>{row.index + 1}</span>;
		}
	},
	{
		accessorKey: "supervisee.name",
		header({ column }) {
			return <DataTableColumnHeader column={column} title="Supervisee" />;
		},
		cell({ row }) {
			const { name, employeeNumber, salaryScale, jobTitle } = row.original.supervisee;
			return (
				<div className="">
					<div className="line-clamp-1 text-ellipsis">{name}</div>
					<div className="line-clamp-1 text-ellipsis text-xs text-muted-foreground">{jobTitle}</div>
					<div className="text-xs text-muted-foreground">
						{salaryScale} ({employeeNumber})
					</div>
				</div>
			);
		}
	},
	{
		accessorKey: "supervisor.name",
		header({ column }) {
			return <DataTableColumnHeader column={column} title="Supervisor" />;
		},
		cell({ row }) {
			const { name, employeeNumber, salaryScale, jobTitle } = row.original.supervisor;
			return (
				<div className="">
					<div className="line-clamp-1 text-ellipsis">{name}</div>
					<div className="line-clamp-1 text-ellipsis text-xs text-muted-foreground">{jobTitle}</div>
					<div className="text-xs text-muted-foreground">
						{salaryScale} ({employeeNumber})
					</div>
				</div>
			);
		}
	},

	{
		accessorKey: "organization",
		header({ column }) {
			return <DataTableColumnHeader column={column} title="Vote/ site" />;
		},
		cell({ row }) {
			const org = row.original.organization;
			if (!org) {
				return <Badge variant={"destructive"}>Not added</Badge>;
			}
			const { icon, label } = organizationStructures[org.structure];
			const Icon = icon;
			return (
				<div>
					<div className="line-clamp-1 text-ellipsis">{org.name}</div>
					<div className="tex-xs flex items-center gap-2 text-muted-foreground">
						<Icon className="size-3" />
						{label}
					</div>
				</div>
			);
		}
	},
	{
		accessorKey: "year",
		header({ column }) {
			return <DataTableColumnHeader column={column} title="Financial Year" />;
		},
		cell({ row }) {
			return <span>{row.original.year}</span>;
		}
	},
	{
		accessorKey: "payments",
		header({ column }) {
			return <DataTableColumnHeader column={column} title="Payments" />;
		},
		cell({ row }) {
			const paidAmount = row.original.payments.map((p) => p.amount).reduce((acc, total) => acc + total, 0);
			const balances = row.original.payments.map((p) => p.balance).reduce((acc, total) => acc + total, 0);
			const hasBalances = balances > 0;
			return (
				<div>
					{paidAmount <= 0 ? (
						<Badge variant={"destructive"}>No payments</Badge>
					) : hasBalances ? (
						<div>
							<p className="dark:text-green-300 text-green-900">Paid {formatLocalCurrency(paidAmount)}</p>
							<div>
								<span className="italic text-destructive">Bal of </span>
								<span className="font-bold">{formatLocalCurrency(balances)}</span>
							</div>
						</div>
					) : (
						<Badge variant={"outline"}>
							<CheckIcon className={cn("text-green-500")} />
							<span className={cn("text-green-900")}>{formatLocalCurrency(paidAmount)}</span>
						</Badge>
					)}
				</div>
			);
		}
	},
	{
		accessorKey: "createdAt",
		header({ column }) {
			return <DataTableColumnHeader column={column} title="Created At" />;
		},
		cell({ row }) {
			const bsc = row.original;
			const created = bsc.createdAt;
			const updated = bsc.updatedAt;
			return (
				<div>
					<div className="line-clamp-1 text-ellipsis text-xs">{format(created, "PPPp")}</div>
					{updated > created && (
						<div className="line-clamp-2 text-ellipsis text-xs">{format(updated, "PPPp")} (updated)</div>
					)}
					<div className="line-clamp-1 font-semibold text-ellipsis text-xs">By: {bsc.user?.name}</div>
				</div>
			);
		}
	},
	{
		id: "action",
		header({ column }) {
			return <DataTableColumnHeader column={column} title="Action" />;
		},
		cell({ row }) {
			const { id, payments } = row.original;
			const [isPending, startTransition] = useTransition();
			const { getNavigationLinkWithPathnameWithoutUpdate } = useCustomSearchParams();
			const newUrl = getNavigationLinkWithPathnameWithoutUpdate(`/balanced-score-cards/bsc/${id}`);
			const balances = payments.map((p) => p.balance).reduce((acc, total) => acc + total, 0);
			const hasBalances = balances > 0;
			function onButtonClicked() {
				hasBalances
					? toast.error("PAYMENT NOT FOUND", { description: "You need to pay for the BSC to view it's content." })
					: startTransition(() => {});
			}
			return (
				<Link href={hasBalances ? "#" : newUrl} onClick={onButtonClicked} className={buttonVariants()}>
					{isPending && <Loader2Icon className="animate-spin mr-1" />}View BSC
				</Link>
			);
		}
	}
];
