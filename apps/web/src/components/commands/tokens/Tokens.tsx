import { DataPill } from "../../DataPill";
import { useQuery } from "react-query";
import { Tokens } from "./types";
import { findToken } from "./helpers";
import Image from "next/image";

export type TokenWidgetProps = {
  property: "price";
  chainName: string;
  token: string;
  platforms: "native" | "basic";
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
  chainName,
  token,
  platforms,
}: Pick<TokenWidgetProps, "chainName" | "token" | "platforms">) => {
  const query = useQuery(
    ["TOKEN", "PRICE", chainName, token, platforms],
    async () => {
      if (token.toLowerCase().trim() === "eth") {
        platforms = "native";
      }
      const url = `https://api.portals.fi/v2/tokens?search=${token}&platforms=${platforms}&networks=${chainName}`;
      const response = await fetch(url);
      const json = await response.json();
      const tokenData: Tokens = findToken({
        query: token,
        tokenList: json.tokens,
      });

      return {
        tokenSymbol: tokenData.symbol,
        tokenPrice: tokenData.price,
        tokenImage: tokenData.image,
        tokenName: tokenData.name,
      };
    }
  );

  if (!query.data) return <div>Loading...</div>;

  return (
    <>
      <DataPill query={query} className="flex flex-row">
          <Image
            src={query.data.tokenImage}
            alt={query.data.tokenName}
            width={30}
            height={0}
            style={{ margin: 0, marginRight: 8 }}
          />
          {query.data?.tokenPrice} {query.data?.tokenSymbol}
      </DataPill>
    </>
  );
};
