import { BSCForm } from "./(components)/bsc-form";
import { getBSCById } from "./action";
import BSCFormInitialData from "./bsc-form-initial-data";

interface PageProps {
  searchParams: Promise<{
    position?: string;
    organization?: string;
    bsc: string;
  }>;
}
export default async function Page({ searchParams }: PageProps) {
  const _searchParams = await searchParams;
  if (!_searchParams.position && !_searchParams.organization) {
    const organizationId = decodeURIComponent(_searchParams.organization || "");
    const positionId = decodeURIComponent(_searchParams.position || "");
    return (
      <BSCFormInitialData
        organizationId={organizationId}
        positionId={positionId}
      />
    );
  }
  const bSC = await getBSCById(_searchParams.bsc);
  return (
    <main className="min-h-screen bg-background">
      <BSCForm bSC={bSC} />
    </main>
  );
}
