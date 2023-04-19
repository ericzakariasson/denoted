import { cn } from "../utils/classnames";
import { TwitterIcon, EmailIcon } from "react-share";

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(className)}>
      <div className="flex-grow border-t border-gray-200"></div>
      <div className="gap 1 my-1 flex -translate-x-2 flex-row">
        <a
          href="https://twitter.com/denotedxyz"
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon
            size={48}
            iconFillColor="#4B5563"
            bgStyle={{
              fill: "transparent",
            }}
          />
        </a>
        <a href="mailto:hey@denoted.xyz" target="_blank" rel="noreferrer">
          <EmailIcon
            size={48}
            iconFillColor="#4B5563"
            bgStyle={{
              fill: "transparent",
            }}
          />
        </a>
      </div>
      <p className="text-[10px] text-gray-500">
        Copyright © 2023 denoted. All rights reserved.
      </p>
    </footer>
  );
}
