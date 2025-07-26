import { Prisma } from "@prisma/client";

export const positionDataInclude = {
  reportsTo: true,
  responsibleFor: true,
} satisfies Prisma.PositionInclude;
export type PositionData = Prisma.PositionGetPayload<{
  include: typeof positionDataInclude;
}>;

export const ospDataInclude = {
  ndp:true
} satisfies Prisma.OspInclude;
export type OspData = Prisma.OspGetPayload<{
  include: typeof ospDataInclude;
}>;

export const ndpDataInclude = {
  osps: { include: ospDataInclude },
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
