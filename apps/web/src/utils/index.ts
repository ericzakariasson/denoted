export const formatEthAddress = (
  address: string,
  sub: number,
  number: number
) => {
  return address.replace(address.substring(sub, number), "...");
};
