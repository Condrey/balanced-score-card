"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import ResponsiveDrawer from "@/components/responsive-drawer";

import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { getPositionsAndOrganizations } from "./action";
import BSCInitialDataForm from "./form-position-and-organization";

interface BSCFormInitialDataProps {
	positionId?: string;
	organizationId?: string;
}

export default function BSCFormInitialData({ positionId, organizationId }: BSCFormInitialDataProps) {
	const [open, setOpen] = useState(true);
	const query = useQuery({
		queryKey: ["position", positionId, "organization", organizationId],
		queryFn: () => getPositionsAndOrganizations({ positionId, organizationId })
	});
	const { status, data } = query;
	return (
		<ResponsiveDrawer
			open={open}
			modal={false}
			setOpen={setOpen}
			title="Preliminary Values"
			description="Please set up these preliminary values before proceeding further."
		>
			{status === "pending" ? (
				<EmptyContainer message={"Fetching initial data from database, Please be patient while loading."}>
					<Loader2Icon className="size-8 animate-spin" />
				</EmptyContainer>
			) : status === "error" ? (
				<ErrorContainer errorMessage="Failed to fetch initial data, please try again!" query={query} />
			) : (
				<BSCInitialDataForm data={data} setOpen={setOpen} />
			)}
		</ResponsiveDrawer>
	);
}
