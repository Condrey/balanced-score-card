import EmptyContainer from "@/components/query-containers/empty-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NdpData, OrganizationContextData } from "@/lib/types";
import { Edit3Icon, PlusIcon, Trash2Icon } from "lucide-react";
import ButtonAddEditOsp from "../(osp)/button-add-edit-osp";
import TableOfOSPs from "../(osp)/table-of-osps";
import ButtonAddEditNdp from "./button-add-edit-ndp";
import ButtonDeleteNdp from "./button-delete-ndp";

interface ListOfNDPsProps {
	ndp: NdpData;
	context: OrganizationContextData;
}
export default function ListOfNDPs({ ndp, context }: ListOfNDPsProps) {
	return (
		<Card>
			<CardHeader className="flex w-full flex-row items-center justify-between gap-3">
				<div>
					<CardTitle>NDP {ndp.version}</CardTitle>
					<CardDescription>This is the NDP that is assigned to this FY{context.financialYear}</CardDescription>
				</div>
				<div className="flex items-center justify-between gap-2">
					<ButtonAddEditNdp context={context} ndp={ndp} size="icon">
						<Edit3Icon />
					</ButtonAddEditNdp>
					<ButtonDeleteNdp variant={"destructive"} size="icon" ndp={ndp} organizationId={context.organizationId!}>
						<Trash2Icon />
					</ButtonDeleteNdp>
				</div>
			</CardHeader>
			<CardContent>
				{!ndp.programmes.length ? (
					<EmptyContainer message={"There are no strategies added to this NDP yet"} />
				) : (
					<ol className="list-inside list-decimal">
						{ndp.programmes.map((programme, index) => (
							<li key={index}>{programme}</li>
						))}
					</ol>
				)}
			</CardContent>
			<CardHeader className="flex flex-row items-center justify-between gap-3">
				<div>
					<CardTitle>OSPs information</CardTitle>
					<CardDescription>These are the Strategic objectives, Strategies, and Programmes</CardDescription>
				</div>
				<ButtonAddEditOsp ndp={context.ndp!}>
					<PlusIcon /> new
				</ButtonAddEditOsp>
			</CardHeader>
			<CardContent>
				{!ndp.osps.length ? (
					<EmptyContainer message={"Please include the OSPs as they are missing"}>
						{" "}
						<ButtonAddEditOsp variant={"secondary"} ndp={context.ndp!}>
							Add a new set of OSP
						</ButtonAddEditOsp>
					</EmptyContainer>
				) : (
					<TableOfOSPs osps={ndp.osps} />
				)}
			</CardContent>
		</Card>
	);
}
