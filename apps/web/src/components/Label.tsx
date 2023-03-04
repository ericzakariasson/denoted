import { PropsWithChildren } from "react";

export type LabelProps = {
  label: string;
};

export const Label = ({ label, children }: PropsWithChildren<LabelProps>) => {
  return (
    <label className="flex w-full flex-col gap-1">
      <p className="text-gray-500">{label}</p>
      {children}
    </label>
  );
};
