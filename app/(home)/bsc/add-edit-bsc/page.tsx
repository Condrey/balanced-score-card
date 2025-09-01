import { BSCForm } from "./(components)/bsc-form";
import { getBscOrganizationContextPositionByIds } from "./action";
import BSCFormInitialData from "./bsc-form-initial-data";

interface PageProps {
  searchParams: Promise<{
    position?: string;
    organization?: string;
    bsc?: string;
    year?: string;
  }>;
}
export default async function Page({ searchParams }: PageProps) {
  const _searchParams = await searchParams;
  const organizationId = decodeURIComponent(_searchParams.organization || "");
  const positionId = decodeURIComponent(_searchParams.position || "");
  const bscId = decodeURIComponent(_searchParams.bsc || "");
  const year = decodeURIComponent(_searchParams.year || "");
  if (!_searchParams.position || !_searchParams.organization) {
    return (
      <BSCFormInitialData
        organizationId={organizationId}
        positionId={positionId}
        year={decodeURIComponent(year || "")}
      />
    );
  }
  const { bSc, organizationContext, position } =
    await getBscOrganizationContextPositionByIds({
      bscId,
      organizationId,
      positionId,
      year,
    });
    console.log({ bSc, organizationContext, position })
  return (
    <main className="min-h-screen bg-background">
      <BSCForm
        bSC={bSc}
        organizationContext={organizationContext}
        position={position}
        year={year}
      />
    </main>
  );
}
