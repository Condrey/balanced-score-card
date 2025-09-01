import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";
import { getAllOrganizations } from "./actions";
import ListOfOrganizations from "./list-of-organizations";

export const metadata: Metadata = {
  title: "List of organizations",
};

export default function Page() {
  return (
    <div className="size-full space-y-4 p-4">
      <h1 className="text-xl font-bold uppercase tracking-tighter">
        Organizations
      </h1>
      <Suspense fallback={<DataTableLoadingSkeleton />}>
        <Content />
      </Suspense>
    </div>
  );
}

async function Content() {
  const organizations = await getAllOrganizations();
  return <ListOfOrganizations organizations={organizations} />;
}
