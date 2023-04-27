import { useEffect, useState } from "react";
import { CommandExtensionProps } from "../lib/tiptap/types";
import { BaseProps } from "./commands/types";
import { useIsMounted } from "connectkit";

export type FormSubmitHandler = (
  values: Record<string, FormDataEntryValue>
) => void;

export function useBlockConfigProps<Props extends BaseProps>(
  props: CommandExtensionProps<Props>,
  propTransform?: <T extends keyof Props>(key: T, value: Props[T]) => Props[T]
) {
  const isMounted = useIsMounted();

  const isConfigured = Object.values(props.node.attrs).every(
    (value) =>
      typeof value !== "undefined" && value !== null && value !== undefined
  );

  const [isOpen, setOpen] = useState(() => !isConfigured);

  useEffect(() => {
    if (!isConfigured) {
      setOpen(true);
    }
  }, [isConfigured]);

  function onSubmit(values: Record<string, FormDataEntryValue>) {
    const updatedProps = Object.keys(values).reduce<Props>((data, key) => {
      const k = key as keyof Props;
      const value = (values[key]?.toString() ?? null) as Props[keyof Props];
      data[k] = propTransform ? propTransform(k, value) : value;
      return data;
    }, {} as Props);

    props.updateAttributes(updatedProps);

    setOpen(false);

    props.editor.view.dom.focus();
  }

  return {
    isConfigured,
    isOpen,
    setOpen: (open: boolean) => {
      if (isMounted) {
        setOpen(open);
      }
    },
    onSubmit,
  };
}
