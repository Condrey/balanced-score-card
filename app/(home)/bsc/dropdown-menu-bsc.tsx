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
import { BSCData } from "@/lib/types";
import {
  ArrowUpRightIcon,
  Edit3Icon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { DialogDeleteBSC } from "./button-delete-bsc";

interface DropdownMenuBSCProps {
  bSC: BSCData;
}

export default function DropdownMenuBSC({ bSC }: DropdownMenuBSCProps) {
  const [openDelete, setOpenDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const newUrl = getNavigationLinkWithPathnameWithoutUpdate(`/bsc/${bSC.id}`);
  const newEditUrl = getNavigationLinkWithPathnameWithoutUpdate(
    `/bsc/${bSC.id}`,
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
                <ArrowUpRightIcon className="mr-2" /> View BSC
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => startTransition(() => {})}>
              <Link href={newEditUrl} className="flex w-full">
                <Edit3Icon className="mr-2" /> Edit BSC
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
              <Trash2Icon /> Delete BSC
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogDeleteBSC open={openDelete} setOpen={setOpenDelete} bSC={bSC} />
    </>
  );
}
