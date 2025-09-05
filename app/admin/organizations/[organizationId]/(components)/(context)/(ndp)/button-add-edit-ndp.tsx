import { Button, ButtonProps } from "@/components/ui/button";
import { NdpData, OrganizationContextData } from "@/lib/types";
import { useState } from "react";
import FormAddEditNdp from "./form-add-edit-ndp";

interface ButtonAddEditNdpProps extends ButtonProps {
  ndp?: NdpData;
  context: OrganizationContextData;
}

export default function ButtonAddEditNdp({
  ndp,
  context,
  ...props
}: ButtonAddEditNdpProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        title={ndp ? "Update this ndp" : "Create a new ndp"}
        onClick={() => setOpen(true)}
        {...props}
      />
      <FormAddEditNdp
        ndp={ndp}
        open={open}
        setOpen={setOpen}
        context={context}
      />
    </>
  );
}
