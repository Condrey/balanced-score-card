import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OspData } from "@/lib/types";
import { Edit3Icon, Trash2Icon } from "lucide-react";
import ButtonAddEditOsp from "./button-add-edit-osp";
import ButtonDeleteOsp from "./button-delete-osp";

interface TableOfOSPsProps {
  osps: OspData[];
}

export default function TableOfOSPs({ osps }: TableOfOSPsProps) {
  return (
    <Table className="border ">
      <TableCaption className="caption-top">
        List of Strategic Objectives, strategies, and programmes.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Strategic Objectives</TableHead>
          <TableHead>Strategies</TableHead>
          <TableHead>Programmes</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {osps.map((value, index) => (
          <TableRow key={value.id} className="*:place-content-start ">
            <TableCell>{index + 1}</TableCell>
            <TableCell>{value.strategicObjective}</TableCell>
            <TableCell>
              <ol className="list-disc list-inside">
                {value.strategies.map((str, _count) => (
                  <li key={_count}>{str}</li>
                ))}
              </ol>
            </TableCell>
            <TableCell>
              <ol className="list-disc list-inside">
                {value.programmes.map((programme, _count) => (
                  <li key={_count}>{programme}</li>
                ))}
              </ol>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 items-center">
                <ButtonAddEditOsp
                  osp={value}
                  ndp={value.ndp!}
                  size={"icon"}
                  variant={"secondary"}
                >
                  <Edit3Icon className="size-4" />
                </ButtonAddEditOsp>
                <ButtonDeleteOsp
                  osp={value}
                  size={"icon"}
                  variant={"destructive"}
                >
                  <Trash2Icon className="size-4" />
                </ButtonDeleteOsp>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
