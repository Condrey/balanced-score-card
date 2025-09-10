import { Button, ButtonProps } from "@/components/ui/button";
import { OrganizationContextData } from "@/lib/types";
import { useState } from "react";
import FormAddEditOrganizationContext from "./form-add-edit-organization-context";

interface ButtonAddEditOrganizationContextProps extends ButtonProps {
	context?: OrganizationContextData;
	organizationId: string;
}

export default function ButtonAddEditOrganizationContext({
	context,
	organizationId,
	...props
}: ButtonAddEditOrganizationContextProps) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button
				title={context ? "Update this context" : "Create a new context"}
				onClick={() => setOpen(true)}
				{...props}
			/>
			<FormAddEditOrganizationContext
				organizationContext={context}
				open={open}
				organizationId={organizationId}
				setOpen={setOpen}
			/>
		</>
	);
}
