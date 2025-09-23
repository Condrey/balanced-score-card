"use client";

import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { OrganizationContextData } from "@/lib/types";
import Link from "next/link";
import { useTransition } from "react";

interface ButtonAddBSCProps extends ButtonProps {
	organizationContext: OrganizationContextData;
}

export default function ButtonAddBSC({ organizationContext, children, ...props }: ButtonAddBSCProps) {
	const [isPending, startTransition] = useTransition();
	return (
		<>
			<Link href="/add-bsc">
				<LoadingButton
					loading={isPending}
					className="Add a balanced score card. "
					onClick={() => startTransition(() => {})}
					{...props}
				>
					{children}
				</LoadingButton>
			</Link>
		</>
	);
}
