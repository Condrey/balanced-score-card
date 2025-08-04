"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button, ButtonProps } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { NdpData } from "@/lib/types";
import { useState } from "react";
import { deleteNdpMutation } from "../../../mutation";

interface ButtonDeleteNdpProps extends ButtonProps {
  ndp: NdpData;
  organizationId: string;
}

export default function ButtonDeleteNdp({
  ndp,
  organizationId,
  ...props
}: ButtonDeleteNdpProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        title={ndp ? "Edit Ndp" : "Add Ndp"}
        onClick={() => setOpen(true)}
        {...props}
      />
      <DialogDeleteNdp
        open={open}
        setOpen={setOpen}
        ndp={ndp}
        organizationId={organizationId}
      />
    </>
  );
}

interface DialogDeleteNdpProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  ndp: NdpData;
  organizationId: string;
}
export function DialogDeleteNdp({
  open,
  setOpen,
  ndp,
  organizationId,
}: DialogDeleteNdpProps) {
  const { isPending, mutate } = deleteNdpMutation(organizationId);
  const deleteItem = () => mutate(ndp.id, { onSuccess: () => setOpen(false) });

  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`Delete NDP ${ndp.version} version`}
      description="Please know that this action can not be undone, proceed with caution. This will delete the NDP and all its OSPs"
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
