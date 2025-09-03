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
import ky from "ky";
import {
  CopyIcon,
  DownloadIcon,
  Edit3Icon,
  MoreHorizontalIcon,
  MoveUpRightIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { DialogDeleteBSC } from "./button-delete-bsc";

interface DropdownMenuBSCProps {
  bSC: BSCData;
}

export default function DropdownMenuBSC({ bSC }: DropdownMenuBSCProps) {
  const [openDelete, setOpenDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const router = useRouter();
  const newUrl = getNavigationLinkWithPathnameWithoutUpdate(`/bsc/${bSC.id}`);
  const newEditUrl = getNavigationLinkWithPathnameWithoutUpdate(
    `/bsc/${bSC.id}`,
  );
  async function printBsc() {
    startTransition(async () => {
      const response = await ky.post(`/api/template`, {
        body: JSON.stringify(bSC),
      });
      if (response.ok) {
        const { message, url, isError } = await response.json<{
          message: string;
          url?: string;
          isError: boolean;
        }>();
        if (!isError && !!url) {
          toast.success(message);
          window.open(url, "_blank");
        } else {
          toast.error(message);
        }
      } else {
        toast.error(response.statusText);
      }
    });
  }
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
                <MoveUpRightIcon className="mr-2" /> View BSC
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Secondary Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <button className="flex w-full" onClick={printBsc}>
                <DownloadIcon className="mr-2" /> Download BSC
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => startTransition(() => {})}>
              <Link href={newEditUrl} className="flex w-full">
                <Edit3Icon className="mr-2" /> Edit BSC
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
              <Trash2Icon /> Delete BSC
            </DropdownMenuItem>
            {process.env.NODE_ENV === "development" && (
              <DropdownMenuItem asChild>
                <button
                  onClick={() => {
                    toast("copied!");
                    navigator.clipboard.writeText(JSON.stringify(bSC, null, 2));
                  }}
                >
                  <CopyIcon />
                </button>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogDeleteBSC open={openDelete} setOpen={setOpenDelete} bSC={bSC} />
    </>
  );
}
