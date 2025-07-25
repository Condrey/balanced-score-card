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
import { Edit3Icon, Trash2Icon } from "lucide-react";

interface ListOfNDPsProps {
  ndp: NdpData;
  context: OrganizationContextData;
}
export default function ListOfNDPs({ ndp, context }: ListOfNDPsProps) {
  return (
    <Card>
      <CardHeader className="flex gap-3 items-center justify-between">
        <div>
          <CardTitle>NDP {ndp.version}</CardTitle>
          <CardDescription>
            This is the NPD that is assigned to this FY
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
          <ol className=" list-disc list-inside">
            {ndp.programmes.map((programme, index) => (
              <li key={index}>{programme}</li>
            ))}
          </ol>
        )}
      </CardContent>
      <CardHeader>
        <CardTitle>OSPs information</CardTitle>
        <CardDescription>
          These are the Strategic objectives, Strategies, and Programmes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!ndp.osps.length ? (
          <EmptyContainer
            message={"Please include the OSPs as they are missing"}
          ></EmptyContainer>
        ) : (
          <div></div>
        )}
      </CardContent>
    </Card>
  );
}
