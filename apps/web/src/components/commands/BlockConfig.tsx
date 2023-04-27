import { PropsWithChildren } from "react";
import { Badge } from "../ui/badge";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormSubmitHandler } from "../use-command-extension-config";
import { ConfigForm, FormField } from "./ConfigForm";

export function BlockConfigButton({
  isConfigured,
  children,
}: PropsWithChildren<{
  isConfigured: boolean;
}>) {
  return (
    <PopoverTrigger>
      {isConfigured ? children : <Badge variant="outline">config</Badge>}
    </PopoverTrigger>
  );
}

export function BlockConfigForm({
  fields,
  onSubmit,
}: {
  fields: FormField[];
  onSubmit: FormSubmitHandler;
}) {
  return (
    <PopoverContent align="start">
      <ConfigForm fields={fields} onSubmit={onSubmit} />
    </PopoverContent>
  );
}
