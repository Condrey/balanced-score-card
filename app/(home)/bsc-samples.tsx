"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import { OrganizationContextData } from "@/lib/types";
import { BSC } from "@prisma/client";
import ButtonAddBSC from "./button-add-bsc";

interface BscSamplesProps {
	balancedScoreCards: BSC[];
	organizationContext: OrganizationContextData;
}

export default function BscSamples({ balancedScoreCards, organizationContext }: BscSamplesProps) {
	// 	const { data: session } = useSession();
	// const year = getCurrentFinancialYear();
	// const organizationId = session?.user.organizationId!;
	// const [open, setOpen] = useState(false);
	// const query = useQuery({
	// 	queryKey: ["organizationContext", organizationId],
	// 	queryFn: async () => getOrganizationContext({ year, organizationId }),
	// 	initialData: organizationContext
	// });
	// const { data, status } = query;
	// if (status === "error") return <ErrorContainer query={query} errorMessage="Failed to get your Organization" />;
	// if (status === "success" && !data)
	// 	return (
	// 		<EmptyContainer message={"You have not set your organization yet."}>
	// 			<BSCFormInitialData />
	// 		</EmptyContainer>
	// 	);

	return (
		<div className="space-y-4">
			<h1 className="text-xl sm:text-2xl font-bold tracking-tighter capitalize">Recent Balance Score cards</h1>
			<div>
				{!balancedScoreCards.length ? (
					<EmptyContainer
						message={"You have not created any Balanced Score card yet. Please add to view here."}
						className="min-h-fit"
					>
						<ButtonAddBSC organizationContext={organizationContext}>Create one</ButtonAddBSC>
					</EmptyContainer>
				) : (
					<div>
						<ButtonAddBSC organizationContext={organizationContext}>Add</ButtonAddBSC>

						<pre>
							{JSON.stringify(
								balancedScoreCards.map((bsc) => `${bsc.year} - ${bsc.id}`),
								null,
								2
							)}
						</pre>
					</div>
				)}
			</div>
		</div>
	);
}
