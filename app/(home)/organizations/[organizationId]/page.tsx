import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrganizationContainer from "./(components)/organization-container";
import { getOrganizationById } from "./action";

interface PageProps {
  params: Promise<{ organizationId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { organizationId } = await params;
  const id = decodeURIComponent(organizationId);
  const organization = await getOrganizationById(id);
  if (!organization) {
    return {
      title: "Organization Not Found",
      description: "The organization you are looking for does not exist.",
    };
  }
  return {
    title: `${organization.voteName} - ${organization.name}`,
    description: `Details for organization ${organization.name} with vote code ${organization.voteName}.`,
  };
}

export default async function Page({ params }: PageProps) {
  const { organizationId } = await params;
  const id = decodeURIComponent(organizationId);
  const organization = await getOrganizationById(id);
  if (!organization) notFound();

  return (
    <div className="flex flex-col gap-4">
      <OrganizationContainer initialData={organization} />
    </div>
  );
}
