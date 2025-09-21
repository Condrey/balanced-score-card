"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BSCData, OrganizationContextData } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { DownloadCloudIcon, FileIcon, MoveRightIcon } from "lucide-react";
import Link from "next/link";
import ButtonAddBSC from "./button-add-bsc";

interface BscSamplesProps {
	balancedScoreCards: BSCData[];
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
		<Card className="space-y-4 cursor-pointer   max-w-5xl w-full mx-auto">
			<CardHeader className="bg-card flex-row justify-between items-center">
				<CardTitle className=" capitalize">Recent Balance Score cards</CardTitle>
				<ButtonAddBSC organizationContext={organizationContext}>New BSC</ButtonAddBSC>
			</CardHeader>
			<CardContent>
				{!balancedScoreCards.length ? (
					<EmptyContainer
						message={"You have not created any Balanced Score card yet. Please add to view here."}
						className="min-h-fit"
					>
						<ButtonAddBSC organizationContext={organizationContext}>Create one</ButtonAddBSC>
					</EmptyContainer>
				) : (
					<div className="space-y-4">
						<div className="flex gap-3 items-center flex-wrap">
							{/* <ButtonAddBSC organizationContext={organizationContext}>New BSC</ButtonAddBSC> */}
							<div className="grid gap-3  sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 ">
								{balancedScoreCards.map((bsc) => (
									<BSCFile bsc={bsc} key={bsc.id} />
								))}
							</div>
						</div>
						{balancedScoreCards.length > 2 && (
							<div className="ms-auto w-full max-w-fit">
								<Link href={"/balanced-score-cards"} className={cn(buttonVariants({ variant: "secondary" }))}>
									View all Balanced Score Cards
									<MoveRightIcon />
								</Link>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function BSCFile({ bsc: { id, year, createdAt, updatedAt, user } }: { bsc: BSCData }) {
	const dateTime = updatedAt > createdAt ? `(Update) ${formatDate(updatedAt)}` : formatDate(createdAt);

	return (
		<div
			key={id}
			className="relative aspect-auto group/bsc hover:bg-primary/20 flex flex-col items-center border rounded-md px-2 py-1"
		>
			<div className="relative ">
				<FileIcon className="size-24 fill-blue-500 group-hover/bsc:fill-primary text-background" strokeWidth={0.4} />
				<span className="text-background text-sm absolute bottom-2 right-4.5">.docx</span>
				<p className="text-background text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">BSC</p>
				<Button
					size={"sm"}
					className="text-background hidden group-hover/bsc:flex  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				>
					<DownloadCloudIcon />
					Download
				</Button>
			</div>
			<Avatar className="absolute top-0.5 left-0.5">
				<AvatarImage src={user?.image!} alt="user image" />
				<AvatarFallback className="uppercase">{user?.name?.substring(0, 1)}</AvatarFallback>
			</Avatar>
			<p className=" text-sm text-center">FY{year}</p>
			<span className="text-muted-foreground text-center text-xs">{dateTime}</span>
		</div>
	);
}
