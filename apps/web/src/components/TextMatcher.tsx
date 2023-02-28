import { ReactNode } from "react";
import reactStringReplace from "react-string-replace";

export const MATCHERS = [
  {
    regex: /(\w+.eth)/,
    component: (ens: string) => {
      return (
        <button className="rounded-full border px-3 py-1" type="button">
          {ens}
        </button>
      );
    },
  },
  {
    regex: /(\w+.lens)/,
    component: (handle: string) => {
      return (
        <button className="rounded-full border px-3 py-1" type="button">
          {handle}
        </button>
      );
    },
  },
  {
    regex: /(\b0x[a-f0-9]{40}\b)/i,
    component: (address: string) => {
      return (
        <button className="rounded-full border px-3 py-1" type="button">
          {address}
        </button>
      );
    },
  },
];

type TextMatcherProps = {
  text: string;
};

export const TextMatcher = ({ text }: TextMatcherProps) => {
  const nodesWithMatches = MATCHERS.reduce<ReactNode[]>((elements, matcher) => {
    elements = reactStringReplace(elements, matcher.regex, (match, i) =>
      matcher.component(match)
    ) as ReactNode[];
    return elements;
  }, reactStringReplace(text) as ReactNode[]);

  return <>{nodesWithMatches}</>;
};
