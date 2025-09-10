"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button, ButtonProps } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { BSCData } from "@/lib/types";
import { useState } from "react";
import { deleteBSCMutation } from "./add-edit-bsc/(components)/mutation";

interface ButtonDeleteBSCProps extends ButtonProps {
	bSC: BSCData;
}

export default function ButtonDeleteBSC({ bSC, ...props }: ButtonDeleteBSCProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button title={bSC ? "Edit BSC" : "Add BSC"} onClick={() => setOpen(true)} {...props} />
			<DialogDeleteBSC open={open} setOpen={setOpen} bSC={bSC} />
		</>
	);
}

interface DialogDeleteBSCProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	bSC: BSCData;
}
export function DialogDeleteBSC({ open, setOpen, bSC }: DialogDeleteBSCProps) {
	const { isPending, mutate } = deleteBSCMutation();
	const deleteItem = () => mutate(bSC.id, { onSuccess: () => setOpen(false) });

	return (
		<ResponsiveDrawer
			open={open}
			setOpen={setOpen}
			title={`Delete this BSC`}
			description="Please know that this action can not be undone, proceed with caution."
		>
			<DialogFooter>
				<Button variant={"outline"} onClick={() => setOpen(false)}>
					Cancel
				</Button>
				<LoadingButton loading={isPending} variant={"destructive"} onClick={deleteItem}>
					Delete
				</LoadingButton>
			</DialogFooter>
		</ResponsiveDrawer>
	);
}
