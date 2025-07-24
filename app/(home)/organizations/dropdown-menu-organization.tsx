import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrganizationData } from "@/lib/types";
import {
  ArrowUpRightIcon,
  Edit3Icon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DialogDeleteOrganization } from "./button-delete-organization";
import FormAddEditOrganization from "./form-add-edit-organization";

interface DropdownMenuOrganizationProps {
  organization: OrganizationData;
}

export default function DropdownMenuOrganization({
  organization,
}: DropdownMenuOrganizationProps) {
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
              <Link href={`/organizations/${organization.id}`} className="w-full flex">
                <ArrowUpRightIcon className="mr-2" /> View Organization
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenEdit(true)}>
              <Edit3Icon /> Edit Organization
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
              <Trash2Icon /> Delete Organization
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <FormAddEditOrganization
        open={openEdit}
        setOpen={setOpenEdit}
        organization={organization}
      />
      <DialogDeleteOrganization
        open={openDelete}
        setOpen={setOpenDelete}
        organization={organization}
      />
    </>
  );
}
