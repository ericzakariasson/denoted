"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AuthSteps } from "./AuthSteps";

type AuthDialogProps = {
  open: boolean;
};

export function AuthDialog({ open }: AuthDialogProps) {
  return (
    <Dialog.Root open={open} modal={false}>
      <Dialog.Portal>
        <Dialog.Content className="fixed top-[50%] left-[50%] mx-auto max-w-3xl translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-8 shadow-lg">
          <Dialog.Title className="text-3xl font-bold text-gray-800">
            Setup account
          </Dialog.Title>
          <Dialog.Close />
          <AuthSteps />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
