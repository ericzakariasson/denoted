import { ComposeClient } from "@composedb/client";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { InjectedConnector } from "@wagmi/core";
import { DIDSession } from "did-session";
import { useAccount } from "wagmi";
import { trackEvent } from "../lib/analytics";
import { DID } from "dids";

export function useCeramic(composeClient: ComposeClient) {
  const { address } = useAccount();

  const connector = new InjectedConnector();

  async function hasSession() {
    if (!address) {
      throw new Error("Address is undefined");
    }

    // for production you will want a better place than localStorage for your sessions.
    const sessionStr = localStorage.getItem("did");

    if (!sessionStr) {
      return false;
    }

    const session = await DIDSession.fromSession(sessionStr);

    return session.hasSession && !session.isExpired;
  }

  async function authenticate() {
    if (!address) {
      throw new Error("Address is undefined");
    }
    const provider = await connector.getProvider();

    // for production you will want a better place than localStorage for your sessions.
    const sessionStr = localStorage.getItem("did");
    let session;

    if (sessionStr) {
      session = await DIDSession.fromSession(sessionStr);
    }

    if (!session || (session.hasSession && session.isExpired)) {
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
      trackEvent("Ceramic Authenticated");
      // Set the session in localStorage.
      localStorage.setItem("did", session.serialize());
    }

    // Set our Ceramic DID to be our session DID.
    composeClient.setDID(session.did as any);
  }

  return {
    authenticate,
    hasSession,
    isInitialized: Boolean(composeClient.id),
  };
}
