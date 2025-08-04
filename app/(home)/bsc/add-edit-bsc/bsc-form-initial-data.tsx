"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import ResponsiveDrawer from "@/components/responsive-drawer";

import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { getPositionsAndOrganizations } from "./action";
import BSCInitialDataForm from "./form-position-and-organization";
import { getMonth, getYear } from "date-fns";

interface BSCFormInitialDataProps {
  positionId?: string;
  organizationId?: string;
  year?: string;
}

export default function BSCFormInitialData({
  positionId,
  organizationId,
  year,
}: BSCFormInitialDataProps) {
  const [_, setOpen] = useState(true);
  const query = useQuery({
    queryKey: ["position", positionId, "organization", organizationId],
    queryFn: () => getPositionsAndOrganizations({ positionId, organizationId }),
  });
  const { status, data } = query;
  const currentYear = getCurrentFinancialYear();
  return (
    <ResponsiveDrawer
      open={true}
      setOpen={setOpen}
      title="Preliminary Values"
      description="Please set up these preliminary values before proceeding further."
    >
      {status === "pending" ? (
        <EmptyContainer
          message={
            "Fetching initial data from database, Please be patient while loading."
          }
        >
          <Loader2Icon className="animate-spin size-8" />
        </EmptyContainer>
      ) : status === "error" ? (
        <ErrorContainer
          errorMessage="Failed to fetch initial data, please try again!"
          query={query}
        />
      ) : (
        <BSCInitialDataForm data={data} year={year || currentYear} />
      )}
    </ResponsiveDrawer>
  );
}

function getCurrentFinancialYear() {
  const today = new Date();
  const year = getYear(today);
  const month = getMonth(today);
  return month >= 6 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
}
