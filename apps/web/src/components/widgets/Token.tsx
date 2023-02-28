import { useQuery } from "react-query";

export type TokenWidgetProps = {
  address: string;
  chain: number;
  type: "holders";
};

export const TokenWidget = ({ address, chain, type }: TokenWidgetProps) => {
  switch (type) {
    case "holders":
      return <TokenHoldersWidget address={address} chain={chain} />;
    default:
      return address;
  }
};

type TokenHoldersWidgetProps = Omit<TokenWidgetProps, "type">;

export const TokenHoldersWidget = ({
  address,
  chain,
}: TokenHoldersWidgetProps) => {
  const { isLoading, data } = useQuery(
    ["TOKEN", "HOLDERS", address, chain],
    async () => {
      const holders = await new Promise<number>((resolve) =>
        setTimeout(() => resolve(10), 2000)
      );

      return holders;
    }
  );

  if (isLoading) {
    return <span>loading...</span>;
  }

  return <span>{data}</span>;
};
