import { DataPill } from "../../DataPill";
import { useQuery } from "react-query";
import { Tokens } from "./types";
import { findToken } from "./tokenHelpers";

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
  console.log({ chainName })

  const query = useQuery(
    ["TOKEN", "PRICE", chainName, token, platforms],
    async () => {
      if(token.toLowerCase().trim() === "eth") {
        platforms = "native"
      }
      const url = `https://api.portals.fi/v2/tokens?search=${token}&platforms=${platforms}&networks=${chainName}`
      const response = await fetch(url);
      console.log({ url })
      console.log({response})
      const json = await response.json();

      const tokenData: Tokens = findToken({query: token, tokenList: json.tokens}) 
      console.log({ tokenData })

      return {
        tokenSymbol: tokenData.symbol,
        tokenPrice: tokenData.price,
        tokenImage: tokenData.image
      }
    }
  );

  return (
    
    <DataPill query={query}>
      {query.data?.tokenPrice} {query.data?.tokenSymbol}
    </DataPill>
  );
};
