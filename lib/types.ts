import { Prisma } from "@prisma/client";

export const positionDataInclude = {
  reportsTo: true,
  responsibleFor: true,
} satisfies Prisma.PositionInclude;
export type PositionData = Prisma.PositionGetPayload<{
  include: typeof positionDataInclude;
}>;

export const ndpDataInclude = {
  osps: true,
} satisfies Prisma.NdpInclude;
export type NdpData = Prisma.NdpGetPayload<{
  include: typeof ndpDataInclude;
}>;

export const organizationContextDataInclude = {
  ndp: { include: ndpDataInclude },
} satisfies Prisma.OrganizationContextInclude;
export type OrganizationContextData = Prisma.OrganizationContextGetPayload<{
  include: typeof organizationContextDataInclude;
}>;

export const organizationDataInclude = {
  organizationContexts: { include: organizationContextDataInclude },
} satisfies Prisma.OrganizationInclude;
export type OrganizationData = Prisma.OrganizationGetPayload<{
  include: typeof organizationDataInclude;
}>;
