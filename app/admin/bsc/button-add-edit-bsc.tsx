"use client";

import ErrorContainer from "@/components/query-containers/error-container";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTransition } from "react";
import { canUserAddExtraBsc } from "./action";

interface ButtonAddEditBSCProps extends ButtonProps {
	url?: string;
}

export default function ButtonAddEditBSC({ url, size, variant, children, ...props }: ButtonAddEditBSCProps) {
	const { data: session } = useSession();
	const [isPending, startTransition] = useTransition();
	const { getNavigationLinkWithPathnameWithoutUpdate } = useCustomSearchParams();
	const newUrl = getNavigationLinkWithPathnameWithoutUpdate(url || "/bsc/add-edit-bsc");

	const query = useQuery({
		queryKey: ["user-can-add-extra", session?.user.id],
		queryFn: canUserAddExtraBsc
	});

	const { data: canAddExtra, status } = query;
	if (status === "pending") {
		return <Skeleton className={cn(buttonVariants({ size, variant, className: "min-w-24" }))} />;
	}
	if (status === "error") {
		return <ErrorContainer errorMessage="" query={query} className="min-h-0" />;
	}
	return (
		<>
			{!canAddExtra ? null : (
				<Link href={newUrl} className={cn("flex items-center gap-2")} onClick={() => startTransition(() => {})}>
					<LoadingButton size={size} variant={variant} loading={isPending} {...props} asChild>
						{children}
					</LoadingButton>
				</Link>
			)}
		</>
	);
}
