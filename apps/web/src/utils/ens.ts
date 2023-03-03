import { ethers } from "ethers";
export async function getEnsAddress(ens: string) {
  const provider = new ethers.providers.InfuraProvider(
    "mainnet",
    process.env.INFURA_API_KEY
  );

  return await provider.resolveName(ens);
}
