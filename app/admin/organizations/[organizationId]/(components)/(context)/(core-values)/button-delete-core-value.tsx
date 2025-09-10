"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button, ButtonProps } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { CoreValueData } from "@/lib/types";
import { useState } from "react";
import { deleteCoreValuesMutation } from "./mutation";

interface ButtonDeleteCoreValueProps extends ButtonProps {
	coreValue: CoreValueData;
}

export default function ButtonDeleteCoreValue({ coreValue, ...props }: ButtonDeleteCoreValueProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button title={coreValue ? "Edit CoreValue" : "Add CoreValue"} onClick={() => setOpen(true)} {...props} />
			<DialogDeleteCoreValue open={open} setOpen={setOpen} coreValue={coreValue} />
		</>
	);
}

interface DialogDeleteCoreValueProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	coreValue: CoreValueData;
}
export function DialogDeleteCoreValue({ open, setOpen, coreValue }: DialogDeleteCoreValueProps) {
	const { isPending, mutate } = deleteCoreValuesMutation();
	const deleteItem = () => mutate(coreValue.id, { onSuccess: () => setOpen(false) });

	return (
		<ResponsiveDrawer
			open={open}
			setOpen={setOpen}
			title={`Delete Core Values of "${coreValue.acronym}" acronym`}
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
