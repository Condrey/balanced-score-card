"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { PositionData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import DropdownMenuPosition from "./dropdown-menu-position";

export const usePositionColumns: ColumnDef<PositionData>[] = [
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
    accessorKey: "jobTitle",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Job Title" />;
    },
    cell({ row }) {
      const staff = row.original;
      return (
        <div>
          <div className="">{staff.jobTitle}</div>
          <div className="text-xs text-muted-foreground">
            {staff.salaryScale}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "duties",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Staff duties" />;
    },
    cell({ row }) {
      const duties = row.original.duties.length;
      const dutyNumber = duties === 1 ? " 1 duty" : `${duties} duties`;
      return <div>{dutyNumber}</div>;
    },
  },
  {
    accessorKey: "departmentalMandate",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="Departmental Mandate" />
      );
    },
    cell({ row }) {
      return (
        <p className="text-sm line-clamp-2 text-ellipsis ">
          {row.original.departmentalMandate}
        </p>
      );
    },
  },
  {
    accessorKey: "reportsTo",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Staff Reports to" />;
    },
    cell({ row }) {
      const reportsTo = row.original.reportsTo;
      return (
        <div>
          {!reportsTo ? (
            <Badge variant={'destructive'}>No supervisor</Badge>
          ) : (
            <>
              <div>{reportsTo.jobTitle}</div>
              <div className="text-xs text-muted-foreground">
                {reportsTo.salaryScale}
              </div>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "responsibleFor",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="Supervises (staffs)" />
      );
    },
    cell({ row }) {
      const responsibleFor = row.original.responsibleFor;
      const MAX_LENGTH = 1;
      return (
        <div>
          {!responsibleFor.length ? (
            <Badge variant={"destructive"}>No supervised staff</Badge>
          ) : (
            <div className="flex flex-wrap gap-2 items-center">
              {responsibleFor.slice(0, MAX_LENGTH).map((staff, index) => (
                <Badge
                  key={index}
                  variant={"secondary"}
                  className="line-clamp-1 text-ellipsis"
                >
                  {staff.jobTitle}
                </Badge>
              ))}
              {responsibleFor.length > MAX_LENGTH && (
                <Badge
                  variant={"secondary"}
                  className="line-clamp-1 text-ellipsis"
                >
                  +{responsibleFor.length - MAX_LENGTH} staffs
                </Badge>
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id:'action',
    header({column}) {
      return <DataTableColumnHeader column={column} title="Action"/>
    },
    cell({row}) {
      return <DropdownMenuPosition position={row.original}/>
    },
  }
];
