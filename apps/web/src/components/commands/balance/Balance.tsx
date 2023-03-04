import process from "process";
import { useQuery } from "react-query";
import { ethers } from "ethers";
import { getEnsAddress } from "../../../utils/ens";
import { DataPill } from "../../DataPill";

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

async function resolveAddress(rawAddress: string) {
  if (rawAddress.endsWith(".eth")) {
    return await getEnsAddress(rawAddress);
  }

  return rawAddress;
}

type WalletBalanceWidgetProps = {
  address: string;
  chain: number;
  symbol: string;
};

const COVALENT_CHAIN_NAME_MAP: Record<number, string> = {
  1: "eth-mainnet",
  10: "optimism-mainnet",
  137: "matic-mainnet",
};

const formatBalance = (balance: string) => {
  return Number(ethers.utils.formatEther(balance)).toFixed(3);
};

export const WalletBalanceWidget = ({
  address,
  chain,
  symbol,
}: WalletBalanceWidgetProps) => {
  const query = useQuery(
    ["WALLET", "BALANCES", address, chain],
    async () => {
      const chainName = COVALENT_CHAIN_NAME_MAP[chain] ?? "";
      const fullAddress = await resolveAddress(address);
      const response = await fetch(
        `https://api.covalenthq.com/v1/${chainName}/address/${fullAddress}/balances_v2/?key=${process.env.NEXT_PUBLIC_COVALENT_KEY}`
      );
      const json = await response.json();

      return json.data?.items as CovalentResponse[];
    },
    {
      cacheTime: 0,
    }
  );

  const item = query.data?.find(
    (item) => item.contract_ticker_symbol.toUpperCase() === symbol.toUpperCase()
  );

  if (!item) {
    return <DataPill query={query}>no data</DataPill>;
  }

  return (
    <DataPill query={query}>
      {formatBalance(item?.balance)} {symbol.toUpperCase()}
    </DataPill>
  );
};
