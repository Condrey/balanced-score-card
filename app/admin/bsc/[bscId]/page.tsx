import { DownloadIcon } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBscById } from "./action";
import { DownloadBscButton } from "./components/download-bsc-button";
import PageContent from "./page-content";

interface PageProps {
	params: Promise<{ bscId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { bscId } = await params;
	const id = decodeURIComponent(bscId);
	const bsc = await getBscById(id);
	return {
		title: bsc ? `${bsc.supervisee.name} - ${bsc.year}` : "BSC not found",
		description: bsc ? `Performance review for ${bsc.supervisee.name} in ${bsc.year}` : "No description available"
	};
}

export default async function Page({ params }: PageProps) {
	const { bscId } = await params;
	const id = decodeURIComponent(bscId);
	const bsc = await getBscById(id);
	if (!bsc) return notFound();
	return (
		<div className="space-y-6">
			<div className="top-10 z-50 flex items-center justify-between gap-3 rounded-md p-3 sm:sticky sm:border sm:bg-card/20 backdrop-blur-2xl">
				<h1 className="text-xl font-bold tracking-tight">Balanced Score Card - FY{bsc.year}</h1>
				<DownloadBscButton bsc={bsc} size={"icon"} className="flex-none">
					<DownloadIcon />
				</DownloadBscButton>
			</div>
			<PageContent initialData={bsc} />
		</div>
	);
}
