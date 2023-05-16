import { PropsWithChildren } from "react";
import { Badge } from "../ui/badge";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormSubmitHandler } from "../use-block-config-props";
import { ConfigForm, FormField } from "./ConfigForm";
import { Settings2 } from "lucide-react";
import { PopperContentProps } from "@radix-ui/react-popover";

export function BlockConfigButton({
  isConfigured,
  children,
}: PropsWithChildren<{
  isConfigured: boolean;
}>) {
  return (
    <PopoverTrigger className="leading-normal">
      {isConfigured ? (
        children
      ) : (
        <Badge
          className="text-md  h-6 px-2 py-0 font-normal"
          variant="secondary"
        >
          <Settings2 className="mr-1 inline h-3 w-3" />
          setup
        </Badge>
      )}
    </PopoverTrigger>
  );
}

export function BlockConfigForm({
  fields,
  onSubmit,
  align = "start",
}: {
  fields: FormField[];
  onSubmit: FormSubmitHandler;
  align: PopperContentProps["align"];
}) {
  return (
    <PopoverContent align={align}>
      <ConfigForm fields={fields} onSubmit={onSubmit} />
    </PopoverContent>
  );
}
