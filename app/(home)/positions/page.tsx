import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";
import { getAllPositions } from "./action";
import ListOfPositions from "./list-of-positions";

export const metadata: Metadata = {
  title: "List of positions",
};

export default function Page() {
  return (
    <div className="size-full space-y-4 p-4">
      <h1 className="text-xl font-bold uppercase tracking-tighter">
        Positions
      </h1>
      <Suspense fallback={<DataTableLoadingSkeleton />}>
        <Content />
      </Suspense>
    </div>
  );
}

async function Content() {
  const positions = await getAllPositions();
  return <ListOfPositions positions={positions} />;
}
