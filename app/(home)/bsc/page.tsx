import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";
import { getAllBSCs } from "./action";
import ListOfBSC from "./list-of-bsc";

export const metadata: Metadata = {
  title: "List of bSC",
};

export default function Page() {
  return (
    <div className="size-full space-y-4 p-4">
      <h1 className="text-xl font-bold uppercase tracking-tighter">
        Balanced Score Cards
      </h1>
      <Suspense fallback={<DataTableLoadingSkeleton />}>
        <Content />
      </Suspense>
    </div>
  );
}

async function Content() {
  const bSCs = await getAllBSCs();
  return <ListOfBSC bSCs={bSCs} />;
}
