import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import { CONTRACT_NAME } from "../deploy-constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const deployment = await deploy(CONTRACT_NAME, {
    from: deployer,
    args: ["Hello World"],
  });

  deployments.log(
    `Contract ${CONTRACT_NAME} deployed at ${deployment.address}`
  );
};

export default func;

func.tags = [CONTRACT_NAME];
