import process from "process";
import { useQuery } from "react-query";
import { ethers } from "ethers";

type CovalentResponse = {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: any;
  logo_url: string;
  last_transferred_at: any;
  native_token: boolean;
  type: string;
  balance: string;
  balance_24h: string;
  quote_rate: number;
  quote_rate_24h: number;
  quote: number;
  quote_24h: number;
  nft_data: any;
};

type WalletBalanceWidgetProps = {
  address: string;
  chain: number;
  symbol: string;
};

const COVALENT_CHAIN_NAME_MAP: Record<number, string> = {
  1: "eth-mainnet",
};

const formatBalance = (balance: string) => {
  return Number(ethers.utils.formatEther(balance)).toFixed(3);
};

export const WalletBalanceWidget = ({
  address,
  chain,
  symbol,
}: WalletBalanceWidgetProps) => {
  const { isLoading, data, isError } = useQuery(
    ["WALLET", "BALANCES", address, chain],
    async () => {
      const chainName = COVALENT_CHAIN_NAME_MAP[chain] ?? "";
      const response = await fetch(
        `https://api.covalenthq.com/v1/${chainName}/address/${address}/balances_v2/?key=${process.env.NEXT_PUBLIC_COVALENT_KEY}`
      );
      const json = await response.json();
      return json.data.items as CovalentResponse[];
    }
  );

  if (isLoading) {
    return <span>loading...</span>;
  }

  if (isError) {
    return <span>an error has occured...</span>;
  }

  const item = data?.find(
    (item) => item.contract_ticker_symbol.toUpperCase() === symbol.toUpperCase()
  );

  if (!item) {
    return <span>404</span>;
  }

  return (
    <span className="rounded-full bg-gray-200 px-1 py-0">
      {formatBalance(item?.balance)} {symbol.toUpperCase()}
    </span>
  );
};
