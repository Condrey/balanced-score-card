"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { BSCData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownIcon, DownloadIcon } from "lucide-react";
import { getBscById } from "./action";
import { BehavioralAssessment } from "./components/behavioral-assessment";
import { DownloadBscButton } from "./components/download-bsc-button";
import PerformancePlanAndAppraisal from "./components/performance-plan/perfromance-plan-and-appraisal";
import ScheduleOfDuty from "./components/schedule-of-duty/schedule-of-duties";
import { StrategicElements } from "./components/strategic-elements";
import SuperviseeSupervisorParticulars from "./components/supervisee-supervisor-particulars/supervisee-supervisor-particulars";

interface PageContentProps {
	initialData: BSCData;
}

export default function PageContent({ initialData }: PageContentProps) {
	const id = initialData.id;
	const query = useQuery({
		queryKey: ["bsc", id],
		queryFn: async () => getBscById(id),
		initialData: initialData
	});
	const { data: bsc, status } = query;
	if (status === "error") return <ErrorContainer query={query} errorMessage="Failed to load BSC. Please try again.!" />;
	if (!bsc) return <EmptyContainer message={"Failed to get BSC"} />;
	return (
		<div className="space-y-6 *:mx-auto *:w-full">
			{/* SECTION 1: SUPERVISEE AND SUPERVISOR PARTICULARS */}
			<SuperviseeSupervisorParticulars
				supervisee={bsc.supervisee}
				supervisor={bsc.supervisor}
				year={bsc.year}
				bscId={bsc.id}
				username={bsc.user?.name || "N/A"}
			/>
			{/* SECTION 2: BSC STRATEGIC ELEMENTS */}
			<StrategicElements bsc={bsc} />
			{/* SECTION 3: PERFORMANCE PLAN AND PERFORMANCE APPRAISAL */}
			<PerformancePlanAndAppraisal bsc={bsc} />
			{/* SECTION 4: PERFORMANCE APPRAISAL - BEHAVIORAL ASSESSMENT  */}
			<BehavioralAssessment behavioralAttributes={bsc.behavioralAttributes} coreValues={bsc.coreValues} />
			{/* ANNEX V: SCHEDULE OF DUTIES */}
			<ScheduleOfDuty bsc={bsc} />
			<footer>
				<p className="mb-3 w-full max-w-4xl text-center text-muted-foreground">
					You can download a full editable word document copy of this Balanced Score Card here
					<ArrowDownIcon className="inline animate-bounce" />
				</p>
				<DownloadBscButton bsc={bsc} className="mx-auto w-full max-w-4xl">
					<DownloadIcon className="mr-2" /> Download this Balance Score card
				</DownloadBscButton>
			</footer>
		</div>
	);
}
