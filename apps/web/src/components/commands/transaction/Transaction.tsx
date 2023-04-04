import process from "process";
import { useQuery } from "react-query";
import { ethers } from "ethers";
import { DataPill } from "../../DataPill";
import { DataStack } from "../../DataStack";
import * as chains from "wagmi/chains";

interface TxLogEvent {
  sender_contract_decimals: number;
  sender_contract_ticker_symbol: string;
  sender_logo_url: string;
  decoded: {
    name: string;
    signature: string;
    params: {
      "name": string,
      "type": string,
      "value": string
    }[];
  } | null;
}

type CovalentResponse = {
  tx_hash: string;
  successful: boolean;
  from_address: string;
  to_address: string;
  value: string;
  fees_paid: string;
  gas_price: number;
  block_signed_at: string;
  block_height: number;
  log_events: TxLogEvent[];
};

export type TransactionWidgetProps = {
  txHash: string;
  chain: number;
};

const formatEther = (wei: string) => Number(ethers.utils.formatEther(wei)).toFixed(3);
const formatGwei = (wei: string) => Number(ethers.utils.formatUnits(wei, "gwei")).toFixed(1);

const truncateAddress = (hex: string) => `${hex.slice(0, 5)}...${hex.slice(-3)}`;

function getExplorerUrl(chain: number, txHash: string) {
  switch (chain) {
    case chains.arbitrum.id:
      return `https://arbiscan.io/tx/${txHash}`;
    case chains.mainnet.id:
      return `https://etherscan.io/tx/${txHash}`;
    case chains.optimism.id:
      return `https://optimistic.etherscan.io/tx/${txHash}`;
    case chains.polygon.id:
      return `https://polygonscan.com/tx/${txHash}`;
    default:
      return null;
  }
}

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

  const erc20Transfers = tx.log_events
    .filter(({ decoded }) => decoded?.name === "Transfer")
    .map(({ decoded, sender_contract_decimals, sender_contract_ticker_symbol }) => {
      const value = decoded?.params.find(({ name }) => name === 'value')?.value;
      const erc20Value = Number(value) / Math.pow(10, sender_contract_decimals);
      return (
        <span className="flex-inline bg-gray-200 rounded-md px-2 py-1 ml-2">
          {Number.isInteger(erc20Value) ? erc20Value : erc20Value.toFixed(2)} {sender_contract_ticker_symbol}
        </span>
      );
    });

  const explorerUrl = getExplorerUrl(chain, tx.tx_hash);

  return <>
    <DataStack query={query}>
      <div className="flex items-center space-x-6 text-sm">
        <div className="text-left text-black">
          <span className="text-xs text-gray-700 dark:text-white">Transaction</span><br />
          {explorerUrl ? (
            <a href={explorerUrl} className="font-normal no-underline hover:underline">{tx.tx_hash.slice(0, 10)}...</a>
          ) : (
            <span>{tx.tx_hash.slice(0, 10)}...</span>
          )}
        </div>
        <div className="text-left text-black">
          <span className="text-xs text-gray-700 dark:text-white">From</span><br/>
          <span>{truncateAddress(tx.from_address)}</span>
        </div>
        <div className="text-left text-black">
          <span className="text-xs text-gray-700 dark:text-white">To</span><br/>
          <span>{truncateAddress(tx.to_address)}</span>
        </div>
        <div className="text-left text-black">
          <span className="text-xs text-gray-700 dark:text-white">Value</span><br/>
          <span>{formatEther(tx?.value)} ETH</span>
        </div>
        <div className="text-left text-black">
          <span className="text-xs text-gray-700 dark:text-white">Fee</span><br/>
          <span>{formatGwei(tx?.fees_paid)} Gwei</span>
        </div>
        <div className="text-left text-black">
          <span className="text-xs text-gray-700 dark:text-white">Gas</span><br/>
          <span>{formatGwei(String(tx?.gas_price))} Gwei</span>
        </div>
      </div>
      {erc20Transfers.length > 0 && (
        <div className="flex text-xs items-center mt-3 text-gray-700">
          <span className="flex-inline">Transfers</span>
          {erc20Transfers}
        </div>
      )}
      <div className="flex text-xs items-center mt-3">
        <span className={tx.successful ? 'flex-inline bg-green-100 text-green-500 font-medium rounded-md px-2 py-1' : 'flex-inline bg-red-100 text-red-200 font-medium rounded-md px-2 py-1'}>{tx.successful ? "✅ Success" : "❌ Failed"}</span>
        <span className="flex-inline ml-2">
          {new Date(tx.block_signed_at).toLocaleDateString('sv-SE', { dateStyle: 'short' })}&nbsp;
          {new Date(tx.block_signed_at).toLocaleTimeString('sv-SE', { timeStyle: 'long', hour12: false })}&nbsp;
        </span>
        <span className="flex-inline ml-2">
          {explorerUrl ? (
            <a href={explorerUrl} className="font-normal no-underline hover:underline">Block #{tx.block_height}</a>
          ) : (
            <span>Block #{tx.block_height}</span>
          )}
        </span>
      </div>
    </DataStack>
  </>;
};
