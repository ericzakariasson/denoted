import { DataPill } from "../../DataPill";
import { useQuery } from "react-query";
import { PortalsResponse, Token } from "./types";
import { findToken } from "./helpers";
import Image from "next/image";
import { SUPPORTED_CHAINS } from "../../../supported-chains";

export type TokenWidgetProps = {
  property: "price";
  chainId: number;
  token: string;
};

export const TokenWidget = ({ property, ...props }: TokenWidgetProps) => {
  switch (property) {
    case "price":
      return <TokenPriceWidget {...props} />;
    default:
      return null;
  }
};

const TokenPriceWidget = ({
  chainId,
  token,
}: Pick<TokenWidgetProps, "chainId" | "token">) => {
  const query = useQuery(["TOKEN", "PRICE", chainId, token], async () => {
    let platforms;
    if (token.toLowerCase().trim() === "eth") {
      platforms = "native";
    }
    if (token.toLowerCase().trim() !== "eth") {
      platforms = "basic";
    }
    const chain = SUPPORTED_CHAINS.find(
      (chain) => Number(chainId) === chain.id
    );

    const url = `https://api.portals.fi/v2/tokens?search=${token}&platforms=${platforms}&networks=${chain?.name.toLowerCase()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch token data. Status: ${response.status} ${response.statusText}`
      );
    }
    const json: PortalsResponse = await response.json();

    const tokenData: Token = findToken({
      query: token,
      tokenList: json.tokens,
    });

    if (!tokenData) return null;

    return {
      tokenSymbol: tokenData?.symbol,
      tokenPrice: tokenData?.price,
      tokenImage: tokenData?.image,
      tokenName: tokenData?.name,
    };
  });

  if (!query.data)
    return <DataPill query={query}>{"No token data returned"}</DataPill>;
  return (
    <DataPill query={query}>
      <div className="inline-flex items-baseline gap-1">
        <Image
          src={query.data.tokenImage}
          alt={query.data.tokenName}
          width={16}
          height={16}
          className="m-0 translate-y-0.5"
        />
        ${query.data?.tokenPrice}
      </div>
    </DataPill>
  );
};
