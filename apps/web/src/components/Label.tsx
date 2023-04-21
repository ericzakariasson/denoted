import { PropsWithChildren } from "react";

export type LabelProps = {
  label: string;
};

export const Label = ({ label, children }: PropsWithChildren<LabelProps>) => {
  return (
    <label className="flex w-full flex-col gap-1">
      <p className="text-slate-500">{label}</p>
      {children}
    </label>
  );
};
