import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

import * as chains from "wagmi/chains";
import { Textarea } from "../ui/textarea";

export type FormField =
  | {
      name: string;
      type: "address";
      defaultValue: string;
    }
  | {
      name: string;
      label: string;
      type: "select";
      options: string[];
      defaultValue: string;
    }
  | {
      name: string;
      type: "chain";
      defaultValue: string;
    }
  | {
      name: string;
      type: "text";
      label?: string;
      placeholder: string;
      defaultValue: string;
    }
  | {
      name: string;
      type: "textarea";
      placeholder: string;
      defaultValue: string;
    };

type ConfigFormProps = {
  fields: FormField[];
  onSubmit: (values: Record<string, FormDataEntryValue>) => void;
};

export function ConfigForm({ fields, onSubmit }: ConfigFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      }}
      className="flex flex-col gap-5"
    >
      {fields.map((field) => {
        switch (field.type) {
          case "address": {
            return (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Address</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="erci.eth or 0x123abc..."
                  defaultValue={field.defaultValue ?? ""}
                  required
                />
              </div>
            );
          }
          case "select": {
            return (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Select
                  name={field.name}
                  defaultValue={field.defaultValue ?? ""}
                  required
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }
          case "chain": {
            return (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Chain</Label>
                <Select
                  name={field.name}
                  defaultValue={field.defaultValue}
                  required
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Chain" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {Object.values(chains)
                      .filter((chain) => {
                        return "testnet" in chain ? false : true;
                      })
                      .map((chain) => (
                        <SelectItem
                          key={chain.name}
                          value={chain.id.toString()}
                        >
                          {chain.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }
          case "text": {
            return (
              <div className="grid gap-2">
                <Label htmlFor={field.name} className="capitalize">
                  {field.label ?? field.name}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  defaultValue={field.defaultValue ?? ""}
                  required
                />
              </div>
            );
          }
          case "textarea": {
            return (
              <div className="grid gap-2">
                <Label htmlFor={field.name} className="capitalize">
                  {field.name}
                </Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  defaultValue={field.defaultValue ?? ""}
                  required
                />
              </div>
            );
          }
        }
      })}
      <Button type="submit">Save</Button>
    </form>
  );
}
