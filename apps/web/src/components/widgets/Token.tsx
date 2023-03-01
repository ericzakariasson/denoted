import process from "process";
import { useQuery } from "react-query";

export type TokenWidgetProps = {
  address: string;
  chain: number;
  type: "holders";
};

export const TokenWidget = ({ address, chain, type }: TokenWidgetProps) => {
  switch (type) {
    case "holders":
      return <WalletBalanceWidget address={address} chain={chain} />;
    default:
      return address;
  }
};

type WalletBalanceWidgetProps = Omit<TokenWidgetProps, "type">;
export const WalletBalanceWidget = ({
  address,
  chain,
}: WalletBalanceWidgetProps) => {
  const { isLoading, data, isError } = useQuery(
    ["TOKEN", "HOLDERS", address, chain],
    async () => {
      const response = await fetch(
        `https://api.covalenthq.com/v1/${chain}/address/${address}/balances_v2/?key=${process.env.NEXT_PUBLIC_COVALENT_KEY}`
      );
      const holders = await response.json();
      return holders.data.items[0].quote;
    }
  );

  if (isLoading) {
    return <span>loading...</span>;
  }

  if (isError) {
    return <span>an error has occured...</span>;
  }

  return <span>{data}</span>;
};
