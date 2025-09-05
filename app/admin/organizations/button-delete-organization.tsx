"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button, ButtonProps } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { OrganizationData } from "@/lib/types";
import { useState } from "react";
import { deleteOrganizationMutation } from "./mutation";

interface ButtonDeleteOrganizationProps extends ButtonProps {
  organization: OrganizationData;
}

export default function ButtonDeleteOrganization({
  organization,
  ...props
}: ButtonDeleteOrganizationProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        title={organization ? "Edit Organization" : "Add Organization"}
        onClick={() => setOpen(true)}
        {...props}
      />
      <DialogDeleteOrganization
        open={open}
        setOpen={setOpen}
        organization={organization}
      />
    </>
  );
}

interface DialogDeleteOrganizationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  organization: OrganizationData;
}
export function DialogDeleteOrganization({
  open,
  setOpen,
  organization,
}: DialogDeleteOrganizationProps) {
  const { isPending, mutate } = deleteOrganizationMutation();
  const deleteItem = () =>
    mutate(organization.id, { onSuccess: () => setOpen(false) });

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`Delete ${organization.name} (${organization.voteName})`}
      description="Please know that this action can not be undone, proceed with caution."
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
