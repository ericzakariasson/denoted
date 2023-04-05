export function findToken({query, tokenList}: any) {
    console.log({ tokenList})
  if (!tokenList || tokenList.length === 0) return;
  return tokenList.find(
    (token: any) =>
      token.symbol.toLowerCase().trim() === query.toLowerCase().trim()
  );
}