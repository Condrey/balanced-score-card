import EmptyContainer from "@/components/query-containers/empty-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NdpData, OrganizationContextData } from "@/lib/types";
import ButtonAddEditNdp from "./button-add-edit-ndp";
import ButtonDeleteNdp from "./button-delete-ndp";
import { Edit3Icon, PlusIcon, Trash2Icon } from "lucide-react";
import TableOfOSPs from "./table-of-osps";
import ButtonAddEditOsp from "./button-add-edit-osp";

interface ListOfNDPsProps {
  ndp: NdpData;
  context: OrganizationContextData;
}
export default function ListOfNDPs({ ndp, context }: ListOfNDPsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row gap-3 items-center w-full justify-between">
        <div>
          <CardTitle>NDP {ndp.version}</CardTitle>
          <CardDescription>
            This is the NDP that is assigned to this FY{context.financialYear}
          </CardDescription>
        </div>
        <div className="flex gap-2 justify-between items-center">
          <ButtonAddEditNdp context={context} ndp={ndp} size="icon">
            <Edit3Icon />
          </ButtonAddEditNdp>
          <ButtonDeleteNdp
            variant={"destructive"}
            size="icon"
            ndp={ndp}
            organizationId={context.organizationId!}
          >
            <Trash2Icon />
          </ButtonDeleteNdp>
        </div>
      </CardHeader>
      <CardContent>
        {!ndp.programmes.length ? (
          <EmptyContainer
            message={"There are no strategies added to this NDP yet"}
          />
        ) : (
          <ol className=" list-decimal list-inside">
            {ndp.programmes.map((programme, index) => (
              <li key={index}>{programme}</li>
            ))}
          </ol>
        )}
      </CardContent>
      <CardHeader className="flex flex-row gap-3 items-center justify-between">
        <div>
          <CardTitle>OSPs information</CardTitle>
          <CardDescription>
            These are the Strategic objectives, Strategies, and Programmes
          </CardDescription>
        </div>
        <ButtonAddEditOsp variant={"secondary"} size="icon" ndp={context.ndp!}>
          <PlusIcon />
        </ButtonAddEditOsp>
      </CardHeader>
      <CardContent>
        {!ndp.osps.length ? (
          <EmptyContainer
            message={"Please include the OSPs as they are missing"}
          >
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
