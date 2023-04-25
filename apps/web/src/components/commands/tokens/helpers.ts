export function findToken({ query, tokenList }: any) {
  if (!tokenList || tokenList.length === 0) return;
  return tokenList.find(
    (token: any) =>
      token.symbol.toLowerCase().trim() === query.toLowerCase().trim()
  );
}
