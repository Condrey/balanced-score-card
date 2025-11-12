"use client";

import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTransition } from "react";

interface ButtonAddEditBSCProps extends ButtonProps {
	url?: string;
}

export default function ButtonAddEditBSC({ url, children, ...props }: ButtonAddEditBSCProps) {
	const [isPending, startTransition] = useTransition();
	const { getNavigationLinkWithPathnameWithoutUpdate } = useCustomSearchParams();
	const newUrl = getNavigationLinkWithPathnameWithoutUpdate(url || "/bsc/add-edit-bsc");
	return (
		<LoadingButton onClick={() => startTransition(() => {})} loading={isPending} {...props} asChild>
			<Link href={newUrl} className={cn("flex items-center gap-2")}>
				{children}
			</Link>
		</LoadingButton>
	);
}
