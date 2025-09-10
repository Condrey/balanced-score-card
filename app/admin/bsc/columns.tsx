"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { organizationStructures } from "@/lib/enums";
import { BSCData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import DropdownMenuBSC from "./dropdown-menu-bsc";

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
			return (
				<>
					<DropdownMenuBSC bSC={row.original} />
				</>
			);
		}
	}
];
