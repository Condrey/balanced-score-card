"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { OrganizationData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import DropdownMenuOrganization from "./dropdown-menu-organization";
import { organizationStructures } from "@/lib/enums";
import { OrganizationStructure } from "@prisma/client";

export const useOrganizationColumns: ColumnDef<OrganizationData>[] = [
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
    accessorKey: "name",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Organization name" />;
    },
    cell({ row }) {
      const organization = row.original;
      return (
        <div>
          <div className="">{organization.name}</div>
          <div className="text-xs text-muted-foreground">
            {organization.voteName}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "structure",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Staff duties" />;
    },
    cell({ row }) {
      const structure = row.original.structure;
      const {label,icon} = organizationStructures[structure];
      const Icon = icon;
      return <Badge variant={structure===OrganizationStructure.CITY?'destructive':
        structure===OrganizationStructure.DISTRICT?'secondary':'default'
      } className=''><Icon className="size-4 mr-2" />{label}</Badge>;
    },
  },
  
  {
    id:'action',
    header({column}) {
      return <DataTableColumnHeader column={column} title="Action"/>
    },
    cell({row}) {
      return <DropdownMenuOrganization organization={row.original}/>
    },
  }
];
