import { Button, ButtonProps } from "@/components/ui/button";
import { BehavioralAttributeData } from "@/lib/types";
import { useState } from "react";
import { FormAddEditBehavioralAttribute } from "./form-edit-behavioral-attribute";

interface ButtonAddEditBehavioralAttributeProps extends ButtonProps {
	behavioralAttribute?: BehavioralAttributeData;
	organizationContextId: string;
}

export default function ButtonAddEditBehavioralAttribute({
	behavioralAttribute,
	organizationContextId,
	...props
}: ButtonAddEditBehavioralAttributeProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button
				title={behavioralAttribute ? "Update these core Value" : "Create a new set of core Value"}
				onClick={() => setOpen(true)}
				{...props}
			/>
			<FormAddEditBehavioralAttribute
				behavioralAttribute={behavioralAttribute}
				open={open}
				setOpen={setOpen}
				organizationContextId={organizationContextId}
			/>
		</>
	);
}
