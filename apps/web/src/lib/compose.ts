import { DIDSession } from 'did-session';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';
import { ComposeClient } from '@composedb/client';
import { definition } from '../composedb/definition';

export const composeClient = new ComposeClient({
  ceramic: 'http://localhost:7007',
  definition
});

export const authenticateCompose = () => authenticate(composeClient)

/**
 * Checks localStorage for a stored DID Session. If one is found we authenticate it, otherwise we create a new one.
 * @returns Promise<DID-Session> - The User's authenticated sesion.
 */
const authenticate = async (composeClient: ComposeClient) => {
  const sessionStr = localStorage.getItem('did'); // for production you will want a better place than localStorage for your sessions.
  let session;

  if (sessionStr) {
    session = await DIDSession.fromSession(sessionStr);
  }

  if (!session || (session.hasSession && session.isExpired)) {
    if (window.ethereum === null || window.ethereum === undefined) {
      throw new Error('No injected Ethereum provider found.');
    }

    // We enable the ethereum provider to get the user's addresses.
    const ethProvider = window.ethereum;
    // request ethereum accounts.
    // @ts-ignore
    const addresses = await ethProvider.enable({
      method: 'eth_requestAccounts'
    });
    const accountId = await getAccountId(ethProvider, addresses[0]);
    const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId);

    /**
     * Create DIDSession & provide capabilities that we want to access.
     * @NOTE: Any production applications will want to provide a more complete list of capabilities.
     *        This is not done here to allow you to add more datamodels to your application.
     */
    // TODO: update resources to only provide access to our composities
    session = await DIDSession.authorize(authMethod, { resources: composeClient.resources });
    // Set the session in localStorage.
    localStorage.setItem('did', session.serialize());
  }

  // Set our Ceramic DID to be our session DID.
  composeClient.setDID(session.did as any);
};
