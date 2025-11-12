"use client";

import { cn } from "@/lib/utils";
import { DefinedUseQueryResult, QueryObserverLoadingErrorResult } from "@tanstack/react-query";
import LoadingButton from "../ui/loading-button";

interface ErrorContainerProps {
	errorMessage: string;
	query: DefinedUseQueryResult | QueryObserverLoadingErrorResult;
	className?: string;
}

export default function ErrorContainer({ errorMessage, query, className }: ErrorContainerProps) {
	console.error(query.error);
	return (
		<div
			className={cn(
				"flex min-h-[20rem] bg-destructive/10 p-3 sm:bg-transparent flex-col items-center justify-center gap-4",
				className
			)}
		>
			<p className="max-w-sm text-center text-muted-foreground">{errorMessage}</p>
			<LoadingButton loading={query.isFetching} variant={"destructive"} onClick={() => query.refetch()}>
				Refresh
			</LoadingButton>
		</div>
	);
}
