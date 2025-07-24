import { Metadata } from "next";
import { getOrganizationById } from "./action";
import { notFound } from "next/navigation";
import { organizationStructures } from "@/lib/enums";

interface PageProps{
    params: Promise<{organizationId:string}>
}

export async function generateMetadata({params}:PageProps):Promise<Metadata> {
      const {organizationId} = await params;
  const id = decodeURIComponent(organizationId);
  const organization = await getOrganizationById(id)
  if (!organization) {
    return {
      title: "Organization Not Found",
      description: "The organization you are looking for does not exist.",
    };
  }
    return {
title: `${organization.voteName} - ${organization.name}`,
description: `Details for organization ${organization.name} with vote code ${organization.voteName}.`,
    }
}

export default async function Page({params}:PageProps) {
  const {organizationId} = await params;
  const id = decodeURIComponent(organizationId);
  const organization = await getOrganizationById(id);
  if (!organization) notFound()
    const {icon} = organizationStructures[organization.structure]
const Icon = icon;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold flex items-center">
        <Icon className="inline-block mr-2" />
        {organization.voteName} - {organization.name}</h1>
      <p className="text-muted-foreground">
        This is the page for organization with ID: {organizationId}
      </p>
      {/* You can add more content or components here */}
    </div>
  );

}