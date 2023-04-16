import { cn } from "../utils/classnames";
import { TwitterIcon } from "react-share";
import { Profile, Theme } from "@lens-protocol/widgets-react";

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(className)}>
      <div className="mb-5 flex flex-row justify-center items-center">
        <a
          href="https://twitter.com/denotedxyz"
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon size={32} round />
        </a>
      </div>
      <p className="text-sm text-gray-500">
        Copyright © 2023 denoted. All rights reserved.
      </p>
    </footer>
  );
}
