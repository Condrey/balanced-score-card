import { Button, ButtonProps } from "@/components/ui/button";
import { OrganizationData } from "@/lib/types";
import FormAddEditOrganization from "./form-add-edit-organization";
import { useState } from "react";

interface ButtonAddEditOrganizationProps extends ButtonProps {
  organization?: OrganizationData;
}

export default function ButtonAddEditOrganization({
  organization,
  ...props
}: ButtonAddEditOrganizationProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        title={organization ? "Edit this organization" : "Add organization"}
        onClick={() => setOpen(true)}
        {...props}
      />
      <FormAddEditOrganization
        organization={organization}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
