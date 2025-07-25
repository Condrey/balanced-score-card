"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button, ButtonProps } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { OrganizationContextData } from "@/lib/types";
import { useState } from "react";
import { deleteOrganizationContextMutation } from "../mutation";

interface ButtonDeleteOrganizationContextProps extends ButtonProps {
  organizationContext: OrganizationContextData;
}

export default function ButtonDeleteOrganizationContext({
  organizationContext,
  ...props
}: ButtonDeleteOrganizationContextProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        title={
          organizationContext
            ? "Edit OrganizationContext"
            : "Add OrganizationContext"
        }
        onClick={() => setOpen(true)}
        {...props}
      />
      <DialogDeleteOrganizationContext
        open={open}
        setOpen={setOpen}
        organizationContext={organizationContext}
      />
    </>
  );
}

interface DialogDeleteOrganizationContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  organizationContext: OrganizationContextData;
}
export function DialogDeleteOrganizationContext({
  open,
  setOpen,
  organizationContext,
}: DialogDeleteOrganizationContextProps) {
  const { isPending, mutate } = deleteOrganizationContextMutation();
  const deleteItem = () =>
    mutate(organizationContext.id, { onSuccess: () => setOpen(false) });

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`Delete ${organizationContext.financialYear} context`}
      description="Please know that this action can not be undone, proceed with caution. This will delete items like the mandate, vision, mission, goal, NPD, e.t.c, for this F/Y"
    >
      <DialogFooter>
        <Button variant={"outline"} onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <LoadingButton
          loading={isPending}
          variant={"destructive"}
          onClick={deleteItem}
        >
          Delete
        </LoadingButton>
      </DialogFooter>
    </ResponsiveDrawer>
  );
}
