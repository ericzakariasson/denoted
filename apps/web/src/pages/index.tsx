import { ChainInfo } from "ui";
import Header from "../components/Header";
import { useAccount, useNetwork } from "wagmi";
import { useQuery } from "react-query";
import axios from "axios";

export default function Web() {
  const { address, isDisconnected } = useAccount();
  const { chain } = useNetwork();

  const { isLoading: isFetchingPrice, data: price = [] } = useQuery(
    ["price"],
    async () => {
      const res = await axios.get(`/api/get-price?currency=ethereum`);
      return res.data || [];
    }
  );

  if (isFetchingPrice) return <div></div>;

  return (
    <>
      <Header />
      {isDisconnected && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "15%",
          }}
        >
          <h1>please connect your wallet</h1>
        </div>
      )}

      {!isDisconnected && chain && address && (
        <>
          <h1>My App Name</h1>
          <ChainInfo chain={chain.name} address={address} />

          <div>
            <h3>
              ETH Price :{" "}
              {isFetchingPrice ? <div>Fetching Price...</div> : price} $
            </h3>
          </div>
        </>
      )}
    </>
  );
}
