import myContractDeploymentLocalhost from "./deployments/localhost/MyContract.json";
import myContractDeploymentRinkeby from "./deployments/rinkeby/MyContract.json";
// import myContractDeploymentMainnet from './deployments/mainnet/MyContract.json';

export * from "./typechain";
import * as _typechain from "./typechain";
import { MyContract__factory } from "./typechain";

export enum Chains {
  LOCALHOST = 31337,
  RINKEBY = 4,
  MAINNET = 1,
}

export const typechain = _typechain;

export type AvailableContracts = MyContract__factory["contractName"];

type AddressObj = Record<AvailableContracts, string>;

const _myContract = new MyContract__factory();

export const Address: Record<any, AddressObj> = {
  [Chains.RINKEBY]: {
    [_myContract.contractName]: myContractDeploymentRinkeby.address,
  },
  [Chains.LOCALHOST]: {
    [_myContract.contractName]: myContractDeploymentLocalhost.address,
  },
  // [Chains.MAINNET]: {
  //   [_myContract.contractName]: myContractDeploymentMainnet.address,
  // },
};

export const getAddress = (
  chain: Chains,
  contract: AvailableContracts
): string => {
  return Address[chain][contract];
};
