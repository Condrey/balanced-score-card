"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { PaymentData } from "@/lib/types";
import { formatLocalCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const usePaymentColumns: ColumnDef<PaymentData>[] = [
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
		accessorKey: "bsc.year",
		header({ column }) {
			return <DataTableColumnHeader column={column} title="BSC" />;
		},
		cell({ row }) {
			const bsc = row.original.bsc;
			return (
				<div className="">
					<div>Balanced Score card</div>
					<div>FY{bsc.year}</div>
				</div>
			);
		}
	},
	{
		accessorKey: "amount",
		header({ column }) {
			return <DataTableColumnHeader column={column} title="Paid" />;
		},
		cell({ row }) {
			const payment = row.original;
			return <div className="">{formatLocalCurrency(payment.amount)}</div>;
		}
	},
	{
		accessorKey: "balance",
		header({ column }) {
			return <DataTableColumnHeader column={column} title="Balance" />;
		},
		cell({ row }) {
			const payment = row.original;
			return <div className="">{formatLocalCurrency(payment.balance)}</div>;
		}
	}
];
