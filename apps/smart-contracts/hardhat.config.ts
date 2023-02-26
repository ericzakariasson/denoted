import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-deploy-ethers";
import "hardhat-gas-reporter";
import "hardhat-deploy";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "solidity-coverage";

import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
const GOERLI_ALCHEMY_KEY = process.env.GOERLI_ALCHEMY_KEY;
const OPTIMISM_GOERLI_ALCHEMY_KEY = process.env.OPTIMISM_GOERLI_ALCHEMY_KEY;
const OPTIMISM_ALCHEMY_KEY = process.env.OPTIMISM_MAINNET_ALCHEMY_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10,
      },
    },
  },
  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: 5000,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      saveDeployments: true,
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      accounts: [`${PRIVATE_KEY}`],
      deploy: ["deploy/mainnet"],
    },
    optimism: {
      chainId: 10,
      url: `https://opt-mainnet.g.alchemy.com/v2/${OPTIMISM_ALCHEMY_KEY}`,
      accounts: [`${PRIVATE_KEY}`],
      deploy: ["deploy/optimism"],
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_ALCHEMY_KEY}`,
      accounts: [`${PRIVATE_KEY}`],
      deploy: ["deploy/goerli"],
    },
    optimismGoerli: {
      chainId: 420,
      url: `https://opt-goerli.g.alchemy.com/v2/${OPTIMISM_GOERLI_ALCHEMY_KEY}`,
      accounts: [`${PRIVATE_KEY}`],
      deploy: ["deploy/optimismGoerli"],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  paths: {
    deployments: "../../packages/web3-config/deployments",
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      mainnet: `${process.env.ETHERSCAN_API_KEY}`,
      optimism: `${process.env.OPTIMISM_ETHERSCAN_API_KEY}`,
      goerli: `${process.env.ETHERSCAN_API_KEY}`,
      optimismGoerli: `${process.env.OPTIMISM_ETHERSCAN_API_KEY}`,
    },
    customChains: [
      {
        network: "optimismGoerli",
        chainId: 420,
        urls: {
          apiURL: "https://api-goerli-optimism.etherscan.io/api",
          browserURL: "https://goerli-optimism.etherscan.io/",
        },
      },
      {
        network: "optimism",
        chainId: 10,
        urls: {
          apiURL: "https://api-optimistic.etherscan.io/api",
          browserURL: "https://optimistic.etherscan.io/",
        },
      },
    ],
  },
  typechain: {
    outDir: "../../packages/web3-config/typechain",
    target: "ethers-v5",
    alwaysGenerateOverloads: true,
  },

  abiExporter: {
    path: "./abi",
    clear: true,
    spacing: 2,
    runOnCompile: true,
  },

  // contractSizer: {
  //   alphaSort: true,
  //   runOnCompile: true,
  //   strict: true,
  // },
};

export default config;
