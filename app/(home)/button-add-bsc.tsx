"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { OrganizationContextData } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import FormAddBalancedScoreCard from "./form-add-balanced-score-card";

interface ButtonAddBSCProps extends ButtonProps {
	organizationContext: OrganizationContextData;
}

export default function ButtonAddBSC({ organizationContext, ...props }: ButtonAddBSCProps) {
	const [open, setOpen] = useState(false);
	const { data: session } = useSession();
	const user = session?.user;

	return (
		<>
			<Button className="Add a balanced score card. " onClick={() => setOpen(true)} {...props} />
			<FormAddBalancedScoreCard open={open} setOpen={setOpen} user={user} />
		</>
	);
}
