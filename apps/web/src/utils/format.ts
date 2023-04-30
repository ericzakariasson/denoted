import { ethers } from "ethers";

export const formatEther = (wei: string) =>
  Number(ethers.utils.formatEther(wei)).toFixed(3);
export const formatGwei = (wei: string) =>
  Number(ethers.utils.formatUnits(wei, "gwei")).toFixed(1);