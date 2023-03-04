import { ComposeClient } from "@composedb/client";
import { DIDSession } from "did-session";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { useAccount, useConnect, useProvider } from "wagmi";

export function useCeramic(composeClient: ComposeClient) {
  const { address } = useAccount();
  const { connectors } = useConnect();

  // console.log("connectors", connectors);

  const web3authProvider = (connectors[0] as any).provider;
  const provider = web3authProvider;

  // const provider = new ethers.providers.Web3Provider(web3authProvider); // web3auth.provider

  // console.log(web3authProvider);

  async function authenticate() {
    if (!address) {
      throw new Error("Address is undefined");
    }

    // for production you will want a better place than localStorage for your sessions.
    const sessionStr = localStorage.getItem("did");
    let session;

    if (sessionStr) {
      session = await DIDSession.fromSession(sessionStr);
    }

    if (!session || (session.hasSession && session.isExpired)) {
      if (window.ethereum === null || window.ethereum === undefined) {
        throw new Error("No injected Ethereum provider found.");
      }

      const accountId = await getAccountId(provider, address);
      const authMethod = await EthereumWebAuth.getAuthMethod(
        provider,
        accountId
      );

      /**
       * Create DIDSession & provide capabilities that we want to access.
       * @NOTE: Any production applications will want to provide a more complete list of capabilities.
       *        This is not done here to allow you to add more datamodels to your application.
       */
      session = await DIDSession.authorize(authMethod, {
        resources: composeClient.resources,
      });
      // Set the session in localStorage.
      localStorage.setItem("did", session.serialize());
    }

    // Set our Ceramic DID to be our session DID.
    composeClient.setDID(session.did as any);
  }
  return { authenticate };
}
