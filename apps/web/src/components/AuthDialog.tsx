"use client";

import { AuthSteps } from "./AuthSteps";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type AuthDialogProps = {
  open: boolean;
};

export function AuthDialog({ open }: AuthDialogProps) {
  return (
    <Dialog open={open} modal={false}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setup account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <AuthSteps />
      </DialogContent>
    </Dialog>
  );
}
