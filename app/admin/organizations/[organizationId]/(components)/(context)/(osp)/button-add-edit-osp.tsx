import { Button, ButtonProps } from "@/components/ui/button";
import { OspData } from "@/lib/types";
import { Ndp } from "@prisma/client";
import { useState } from "react";
import FormAddEditOsp from "./form-add-edit-osp";

interface ButtonAddEditOspProps extends ButtonProps {
	osp?: OspData;
	ndp: Ndp;
}

export default function ButtonAddEditOsp({ osp, ndp, ...props }: ButtonAddEditOspProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button title={osp ? "Update this osp" : "Create a new osp"} onClick={() => setOpen(true)} {...props} />
			<FormAddEditOsp osp={osp} open={open} setOpen={setOpen} ndp={ndp} />
		</>
	);
}
