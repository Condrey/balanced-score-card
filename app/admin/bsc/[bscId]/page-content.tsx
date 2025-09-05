"use client";

import { BSCData } from "@/lib/types";
import { ArrowDownIcon, DownloadIcon } from "lucide-react";
import { BehavioralAssessment } from "./components/behavioral-assessment";
import { DownloadBscButton } from "./components/download-bsc-button";
import PerformancePlanAndAppraisal from "./components/perfromance-plan-and-appraisal";
import { StrategicElements } from "./components/strategic-elements";
import SuperviseeSupervisorParticulars from "./components/supervisee-supervisor-particulars";

interface PageContentProps {
  bsc: BSCData;
}

export default function PageContent({ bsc }: PageContentProps) {
  return (
    <div className="space-y-6 *:mx-auto *:w-full">
      {/* SECTION 1: SUPERVISEE AND SUPERVISOR PARTICULARS */}
      <SuperviseeSupervisorParticulars
        supervisee={bsc.supervisee}
        supervisor={bsc.supervisor}
      />
      {/* SECTION 2: BSC STRATEGIC ELEMENTS */}
      <StrategicElements bsc={bsc} />
      {/* SECTION 3: PERFORMANCE PLAN AND PERFORMANCE APPRAISAL */}
      <PerformancePlanAndAppraisal
        performanceObjectives={bsc.performanceObjectives}
        clients={bsc.clients}
      />
      {/* SECTION 4: PERFORMANCE APPRAISAL - BEHAVIORAL ASSESSMENT  */}
      <BehavioralAssessment
        behavioralAttributes={bsc.behavioralAttributes}
        coreValues={bsc.coreValues}
      />
      <footer>
        <p className="mb-3 w-full max-w-4xl text-center text-muted-foreground">
          You can download a full editable word document copy of this Balanced
          Score Card here
          <ArrowDownIcon className="inline animate-bounce" />
        </p>
        <DownloadBscButton bsc={bsc} className="mx-auto w-full max-w-4xl">
          <DownloadIcon className="mr-2" /> Download this Balance Score card
        </DownloadBscButton>
      </footer>
    </div>
  );
}
