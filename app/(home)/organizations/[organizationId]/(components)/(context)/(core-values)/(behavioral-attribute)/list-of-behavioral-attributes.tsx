import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BehavioralAttributeData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Edit3Icon, Trash2Icon } from "lucide-react";
import ButtonDeleteBehavioralAttribute from "./button-delete-behavioral-attribute";
import ButtonAddEditBehavioralAttribute from "./button-edit-behavioral-attribute";

interface ListOfBehavioralAttributesProps {
  behavioralAttributes: BehavioralAttributeData[];
  organizationContextId: string;
}

export default function ListOfBehavioralAttributes({
  behavioralAttributes,
  organizationContextId,
}: ListOfBehavioralAttributesProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>General behavioral Attribute</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {behavioralAttributes.map((behavioralAttribute, index) => (
          <TableRow key={behavioralAttribute.id}>
            <TableCell className="text-muted-foreground">{index + 1}</TableCell>
            <TableCell>
              {behavioralAttribute.attribute} ({behavioralAttribute.percentage}
              %)
            </TableCell>
            <TableCell
              className={cn(
                !behavioralAttribute.description &&
                  "italic text-muted-foreground",
              )}
            >
              {behavioralAttribute.description ||
                "--Please edit to add description.--"}
            </TableCell>
            <TableCell>
              <div className=" gap-1.5 flex items-center flex-row">
                <ButtonAddEditBehavioralAttribute
                  size={"icon"}
                  variant={"secondary"}
                  organizationContextId={organizationContextId}
                  behavioralAttribute={behavioralAttribute}
                >
                  <Edit3Icon />
                </ButtonAddEditBehavioralAttribute>
                <ButtonDeleteBehavioralAttribute
                  size={"icon"}
                  variant={"destructive"}
                  behavioralAttribute={behavioralAttribute}
                >
                  <Trash2Icon />
                </ButtonDeleteBehavioralAttribute>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>
        This table shows the behavioral attributes as extracted from the core
        values.
      </TableCaption>
    </Table>
  );
}
