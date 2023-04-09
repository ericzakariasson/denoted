export enum supportedChains {
  ETHEREUM = "ethereum",
  OPTIMISM = "optimism", 
  FANTOM = "fantom",
  ARBITRUM = "arbitrum",
  POLYGON = "polygon",
  AVALANCHE = "avalanche", 
  BSC = "bsc"
}

export function findToken({query, tokenList}: any) {
  if (!tokenList || tokenList.length === 0) return;
  return tokenList.find(
    (token: any) =>
      token.symbol.toLowerCase().trim() === query.toLowerCase().trim()
  );
}