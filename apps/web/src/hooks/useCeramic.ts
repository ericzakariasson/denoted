import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { InjectedConnector } from "@wagmi/core";
import { DIDSession } from "did-session";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import { trackEvent } from "../lib/analytics";
import { composeClient } from "../lib/compose";

export const LOCAL_STORAGE_KEYS = {
  DID: "denoted.ceramic.did",
  SIGNED_RESOURCES: "denoted.ceramic.signed-resources",
};

export function useCeramic() {
  const { address } = useAccount();

  const connector = new InjectedConnector();

  function isSessionValid(session: DIDSession | null) {
    return !!session && session.hasSession && !session.isExpired;
  }

  async function hasSession() {
    const session = await getSession();
    return isSessionValid(session);
  }

  async function getSession() {
    if (!address) {
      return null;
    }

    // for production you will want a better place than localStorage for your sessions.
    const sessionStr = localStorage.getItem(LOCAL_STORAGE_KEYS.DID);

    if (!sessionStr) {
      return null;
    }

    const session = await DIDSession.fromSession(sessionStr);

    return session;
  }

  function getIsResourcesSigned(resources: string[]) {
    if (typeof window === "undefined") {
      return false;
    }

    const signedResources = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.SIGNED_RESOURCES) ?? "[]"
    ) as string[];

    return resources.every((resource) => {
      return signedResources.includes(resource);
    });
  }

  const isComposeResourcesSignedQuery = useQuery(
    ["CERAMIC", "AUTHENTICATED"],
    async () => {
      return getIsResourcesSigned(composeClient.resources);
    },
    { cacheTime: 0 }
  );

  async function authenticate() {
    if (!address) {
      throw new Error("Address is undefined");
    }
    const provider = await connector.getProvider();

    // for production you will want a better place than localStorage for your sessions.
    let session = await getSession();

    const isResourcesSigned = getIsResourcesSigned(composeClient.resources);

    if (
      !isResourcesSigned ||
      !session ||
      !isSessionValid(session)
    ) {
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
      trackEvent("Ceramic Authenticated", { from: 'authenticate' });
      // Set the session in localStorage.
      localStorage.setItem(LOCAL_STORAGE_KEYS.DID, session.serialize());
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.SIGNED_RESOURCES,
        JSON.stringify(composeClient.resources)
      );
    }

    // Set our Ceramic DID to be our session DID.
    composeClient.setDID(session.did as any);
    trackEvent("Ceramic Authenticated", { from: 'session' });
    isComposeResourcesSignedQuery.refetch();
  }

  return {
    authenticate,
    hasSession,
    isInitialized: Boolean(composeClient.id),
    isComposeResourcesSigned: isComposeResourcesSignedQuery.data ?? false,
  };
}
