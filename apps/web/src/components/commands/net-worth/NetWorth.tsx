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

export type NetWorthWidgetProps = {
  address: string;
  chain: number;
};

const formatBalance = (balance: string) => {
  return Number(ethers.utils.formatEther(balance)).toFixed(3);
};

export const NetWorthWidget = ({ address, chain }: NetWorthWidgetProps) => {
  const query = useQuery(["WALLET", "BALANCES", address, chain], async () => {
    const fullAddress = await resolveAddress(address);
    const response = await fetch(
      `https://api.covalenthq.com/v1/${chain}/address/${fullAddress}/balances_v2/?key=${process.env.NEXT_PUBLIC_COVALENT_KEY}`
    );

    if (response.status === 404) {
      return [];
    }

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json?.error_message);
    }

    return json.data?.items as CovalentResponse[];
  });

  const total = query.data?.reduce((total, item) => {
    total += item.quote;
    return total;
  }, 0);

  return <DataPill query={query}>${total?.toFixed(1) ?? 0}</DataPill>;
};
