import { Metadata } from "next";
import { getPositionById } from "./action";
import { notFound } from "next/navigation";
import PositionContainer from "./position-content";

interface PageProps {
  params: Promise<{ positionId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { positionId } = await params;
  const id = decodeURIComponent(positionId);
  const position = await getPositionById(id);
  if (!position) {
    return {
      title: "Position Not Found",
      description: "The position you are looking for does not exist.",
    };
  }
  return {
    title: `${position.jobTitle} - ${position.salaryScale}`,
    description: `Details for position ${position.jobTitle} with salary scale ${position.salaryScale}.`,
  };
}

export default async function Page({ params }: PageProps) {
  const { positionId } = await params;
  const id = decodeURIComponent(positionId);
  const position = await getPositionById(id);
  if (!position) notFound();

  return <PositionContainer initialData={position} />;
}
