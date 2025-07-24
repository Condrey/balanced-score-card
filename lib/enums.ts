import { OrganizationStructure } from "@prisma/client";
import { Building2Icon, BuildingIcon, GanttChartSquareIcon, LucideIcon, ShapesIcon } from "lucide-react";

export const allOrganizationStructures = Object.values(OrganizationStructure)

export const organizationStructures: Record<OrganizationStructure, {label:string, icon:LucideIcon}> = {
    CITY: {
        label: "City",
        icon: Building2Icon
    },
    DISTRICT: {
        label: "District",
        icon: BuildingIcon
    },
    MUNICIPALITY: {
        label: "Municipality",
        icon: ShapesIcon
    },
    LOCAL_GOVERNMENT: {
        label: "Local Government",
        icon: GanttChartSquareIcon
    }
}