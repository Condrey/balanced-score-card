import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PositionData } from "@/lib/types";
import {
  ArrowUpRightIcon,
  Edit3Icon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DialogDeletePosition } from "./button-delete-position";
import FormAddEditPosition from "./form-add-edit-position";

interface DropdownMenuPositionProps {
  position: PositionData;
}

export default function DropdownMenuPosition({
  position,
}: DropdownMenuPositionProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setOpenEdit(true)}>
              <Link href={`/positions/${position.id}`} className="w-full flex">
                <ArrowUpRightIcon className="mr-2" /> View Position
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenEdit(true)}>
              <Edit3Icon /> Edit Position
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
              <Trash2Icon /> Delete Position
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <FormAddEditPosition
        open={openEdit}
        setOpen={setOpenEdit}
        position={position}
      />
      <DialogDeletePosition
        open={openDelete}
        setOpen={setOpenDelete}
        position={position}
      />
    </>
  );
}
