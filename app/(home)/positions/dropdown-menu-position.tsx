import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingButton from "@/components/ui/loading-button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { PositionData } from "@/lib/types";
import {
  ArrowUpRightIcon,
  Edit3Icon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const newUrl = getNavigationLinkWithPathnameWithoutUpdate(
    `/positions/${position.id}`,
  );
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <LoadingButton loading={isPending} variant={"ghost"} size={"icon"}>
            <MoreHorizontalIcon />
          </LoadingButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => startTransition(() => {})}>
              <Link href={newUrl} className="flex w-full">
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
