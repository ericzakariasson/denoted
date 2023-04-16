import { cn } from "../utils/classnames";
import { TwitterIcon, LinkedinIcon, EmailIcon } from "react-share";

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(className)}>
      <div className="mb-5 flex flex-row justify-center items-center gap-5">
        <a
          href="https://twitter.com/denotedxyz"
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon size={40} round />
        </a>
        <a
          href="https://example.com"
          target="_blank"
          rel="noreferrer"
        >
          <LinkedinIcon size={40} round />
        </a>
        <a
          href="https://example.com"
          target="_blank"
          rel="noreferrer"
        >
          <EmailIcon size={40} round />
        </a>
      </div>
      <p className="text-sm text-gray-500">
        Copyright © 2023 denoted. All rights reserved.
      </p>
    </footer>
  );
}
