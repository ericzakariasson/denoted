// Web3Auth Libraries
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Chain } from "@wagmi/core";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector/dist/web3authWagmiConnector.esm";

export default function Web3AuthConnectorInstance(chains: Chain[]) {
  // Create Web3Auth Instance
  const name = "Denoted";
  const iconUrl = "https://web3auth.io/docs/contents/logo-ethereum.png";
  const web3AuthInstance = new Web3Auth({
    clientId:
      "BMJyE6XQO6A3sfo9lr8-EwhwPXqV3KlblOIOUsM-hCgMjgmpV_KPn7QbVkioRrCRKzNSTC4ASyYEp2NG-R9Ne64", //process.env.NEXT_PUBLIC_WEB3_AUTH_KEY as string,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x" + chains[0].id.toString(16),
      rpcTarget: process.env.NEXT_PUBLIC_INFURA_WEB_KEY,
      displayName: chains[0].name,
      tickerName: chains[0].nativeCurrency?.name,
      ticker: chains[0].nativeCurrency?.symbol,
    },
    uiConfig: {
      appName: name,
      theme: "light",
      loginMethodsOrder: ["facebook", "google"],
      defaultLanguage: "en",
      appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
      modalZIndex: "2147483647",
    },
  });

  const openloginAdapterInstance = new OpenloginAdapter({
    adapterSettings: {
      network: "cyan",
      uxMode: "popup",
      whiteLabel: {
        name: "Your app Name",
        logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
        logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        defaultLanguage: "en",
        dark: true,
      },
    },
  });
  web3AuthInstance.configureAdapter(openloginAdapterInstance);

  const connector = new Web3AuthConnector({
    chains: chains,
    options: {
      web3AuthInstance,
    },
  });
  return connector;
}
