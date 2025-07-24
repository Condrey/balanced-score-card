import { Prisma } from "@prisma/client";

export const positionDataInclude = {
  reportsTo: true,
  responsibleFor: true,
} satisfies Prisma.PositionInclude;
export type PositionData = Prisma.PositionGetPayload<{
  include: typeof positionDataInclude;
}>;


export const organizationDataInclude= {

} satisfies Prisma.OrganizationInclude
export type OrganizationData = Prisma.OrganizationGetPayload<{include: typeof organizationDataInclude}>