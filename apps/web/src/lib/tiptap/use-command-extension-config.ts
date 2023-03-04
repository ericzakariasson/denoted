import { useState, useEffect } from "react";
import { CommandExtensionProps } from "./types";

export function useCommandExtensionConfig<
  Props extends Record<string, string | number | null>
>(props: CommandExtensionProps<Props>) {
  const isConfigured = Object.values(props.node.attrs).every(
    (value) => value !== null
  );

  const [isOpen, setOpen] = useState(!isConfigured);

  useEffect(() => {
    if (!isConfigured) {
      setOpen(true);
    }
  }, [isConfigured]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const updatedProps = Object.keys(props.node.attrs).reduce<Props>(
      (data, key) => {
        data[key as keyof Props] = (formData.get(key)?.toString() ??
          null) as Props[keyof Props];
        return data;
      },
      {} as Props
    );

    props.updateAttributes(updatedProps);

    setOpen(false);

    props.editor.view.dom.focus();
  }

  return { isConfigured, isOpen, setOpen, onSubmit };
}
