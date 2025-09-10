import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import LoadingButton from "@/components/ui/loading-button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { OrganizationData } from "@/lib/types";
import { ArrowUpRightIcon, Edit3Icon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { DialogDeleteOrganization } from "./button-delete-organization";
import FormAddEditOrganization from "./form-add-edit-organization";

interface DropdownMenuOrganizationProps {
	organization: OrganizationData;
}

export default function DropdownMenuOrganization({ organization }: DropdownMenuOrganizationProps) {
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { getNavigationLinkWithPathnameWithoutUpdate } = useCustomSearchParams();
	const newUrl = getNavigationLinkWithPathnameWithoutUpdate(`/admin/organizations/${organization.id}`);

	return (
		<>
			<DropdownMenu>
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
			<FormAddEditOrganization open={openEdit} setOpen={setOpenEdit} organization={organization} />
			<DialogDeleteOrganization open={openDelete} setOpen={setOpenDelete} organization={organization} />
		</>
	);
}
