import process from "process";
import { useQuery } from "react-query";
import { ethers } from "ethers";
import { DataPill } from "../../DataPill";
import { DataStack } from "../../DataStack";

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

const truncateAddress = (hex: string) => `${hex.slice(0, 5)}...${hex.slice(-3)}`;

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
    <DataStack query={query}>
      <div className="flex items-center space-x-6 text-sm">
        <div className="text-left text-black">
          <span className="text-xs text-gray-700 dark:text-white">Transaction</span><br />
          <a href={`https://arbiscan.io/tx/${tx.tx_hash}`} className="font-normal no-underline hover:underline">{tx.tx_hash.slice(0, 10)}...</a>
          {/* TODO: map block explorers  */}
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
          <span>{formatBalance(tx?.value)} ETH</span>
        </div>
      </div>
      {/* TODO: gas price & fee  */}
      <div className="flex text-xs items-center mt-3 text-gray-700">
        <span className="flex-inline">Transfers</span>
        {/* TODO: gas ERC20 transfers  */}
        <span className="flex-inline bg-gray-200 rounded-md px-2 py-1 ml-2">3 ARB</span>
        <span className="flex-inline bg-gray-200 rounded-md px-2 py-1 ml-2">3 ARB</span>
      </div>
      <div className="flex text-xs items-center mt-3">
        <span className={tx.successful ? 'flex-inline bg-green-100 text-green-500 font-medium rounded-md px-2 py-1' : 'flex-inline bg-red-100 text-red-200 font-medium rounded-md px-2 py-1'}>{tx.successful ? "✅ Success" : "❌ Failed"}</span>
        <span className="flex-inline ml-2">
          {new Date(tx.block_signed_at).toLocaleDateString('sv-SE', { dateStyle: 'short' })}&nbsp;
          {new Date(tx.block_signed_at).toLocaleTimeString('sv-SE', { timeStyle: 'long', hour12: false })}
        </span>
      </div>
    </DataStack>
  </>;
};
