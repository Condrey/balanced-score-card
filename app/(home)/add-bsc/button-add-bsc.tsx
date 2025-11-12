"use client";

import { canUserAddExtraBsc } from "@/app/admin/bsc/action";
import ErrorContainer from "@/components/query-containers/error-container";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { OrganizationContextData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTransition } from "react";

interface ButtonAddBSCProps extends ButtonProps {
	organizationContext: OrganizationContextData;
	url?: string;
}

export default function ButtonAddBSC({
	organizationContext,
	url,
	size,
	variant,
	children,
	...props
}: ButtonAddBSCProps) {
	const { data: session } = useSession();
	const [isPending, startTransition] = useTransition();
	const { getNavigationLinkWithPathnameWithoutUpdate } = useCustomSearchParams();
	const newUrl = getNavigationLinkWithPathnameWithoutUpdate(url || "/add-bsc");

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
				<Link onClick={() => startTransition(() => {})} href="/add-bsc">
					<LoadingButton
						size={size}
						variant={variant}
						loading={isPending}
						className="Add a balanced score card. "
						{...props}
					>
						{children}
					</LoadingButton>
				</Link>
			)}
		</>
	);
}
