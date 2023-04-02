import process from "process";
import { useQuery } from "react-query";
import { ethers } from "ethers";
import { DataPill } from "../../DataPill";

type CovalentResponse = {
  tx_hash: string;
  successful: boolean;
  from_address: string;
  to_address: string;
  value: string;
  block_signed_at: string;
};

export type TransactionWidgetProps = {
  txHash: string;
  chain: number;
};

const formatBalance = (balance: string) => {
  return Number(ethers.utils.formatEther(balance)).toFixed(3);
};

const truncateHexString = (hex: string) => `${hex.slice(0, 5)}...${hex.slice(-3)}`;

export const TransactionWidget = ({ txHash, chain }: TransactionWidgetProps) => {
  const query = useQuery(["TRANSACTION", txHash, chain], async () => {
    const response = await fetch(
      `https://api.covalenthq.com/v1/${chain}/transaction_v2/${txHash}/?key=${process.env.NEXT_PUBLIC_COVALENT_KEY}`
    );
    
    if (!response.ok) {
      return [];
    }

    const json = await response.json();

    return json.data?.items as CovalentResponse[];
  });

  const tx = query.data?.find(({ tx_hash }) => tx_hash === txHash);
  
  if (!tx) {
    return <DataPill query={query}>no data</DataPill>;
  }

  return <>
    <DataPill query={query}>
      <b>Tx</b> <a href={`https://arbiscan.io/tx/${tx.tx_hash}`}> {truncateHexString(tx.tx_hash)}</a>
      : {truncateHexString(tx.from_address)} -> {truncateHexString(tx.to_address)}
      &nbsp;with {formatBalance(tx?.value)} ETH&nbsp;@ {new Date(tx.block_signed_at).toLocaleString()}
      &nbsp;{tx.successful ? "✅" : "❌"}
    </DataPill>
  </>;
};
