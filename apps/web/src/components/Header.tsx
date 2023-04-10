import { ConnectKitButton } from "connectkit";
import { cn } from "../utils/classnames";

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn("flex justify-end", className)}>
      <ConnectKitButton />
    </header>
  );
}
