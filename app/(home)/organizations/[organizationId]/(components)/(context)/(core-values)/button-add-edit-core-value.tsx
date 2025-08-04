import { Button, ButtonProps } from "@/components/ui/button";
import { CoreValueData, OrganizationContextData } from "@/lib/types";
import { useState } from "react";
import { FormAddEditCoreValue } from "./form-add-edit-core-value";

interface ButtonAddEditCoreValueProps extends ButtonProps {
  coreValue?: CoreValueData;
  context: OrganizationContextData;
}

export default function ButtonAddEditCoreValue({
  coreValue,
  context,
  ...props
}: ButtonAddEditCoreValueProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        title={
          coreValue
            ? "Update these core Value"
            : "Create a new set of core Value"
        }
        onClick={() => setOpen(true)}
        {...props}
      />
      <FormAddEditCoreValue
        coreValue={coreValue}
        open={open}
        setOpen={setOpen}
        organizationContextId={context.id}
      />
    </>
  );
}
