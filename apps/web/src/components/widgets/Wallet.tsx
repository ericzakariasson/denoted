import process from "process";
import { useQuery } from "react-query";

type WalletBalanceWidgetProps = {
  address: string;
  chain: number;
};

const COVALENT_CHAIN_NAME_MAP: Record<number, string> = {
  1: "eth-mainnet",
};

export const WalletBalanceWidget = ({
  address,
  chain,
}: WalletBalanceWidgetProps) => {
  const { isLoading, data, isError } = useQuery(
    ["WALLET", "BALANCE", address, chain],
    async () => {
      const chainName = COVALENT_CHAIN_NAME_MAP[chain] ?? "";
      const response = await fetch(
        `https://api.covalenthq.com/v1/${chainName}/address/${address}/balances_v2/?key=${process.env.NEXT_PUBLIC_COVALENT_KEY}`
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
