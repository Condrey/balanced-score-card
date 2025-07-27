"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { BSCData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import DropdownMenuBSC from "./dropdown-menu-bsc";

export const useBSCColumns: ColumnDef<BSCData>[] = [
  {
    id: "index",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="S/N" />;
    },
    cell({ row }) {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "id",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Job Title" />;
    },
    cell({ row }) {
      const bsc = row.original;
      return <div className="">{bsc.id}</div>;
    },
  },

  {
    id: "action",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Action" />;
    },
    cell({ row }) {
      return <DropdownMenuBSC bSC={row.original} />;
    },
  },
];
