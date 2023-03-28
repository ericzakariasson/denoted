# ceramic

## Local Development

This is a short version of running a local development, please read the official documentation if it doesn't work [here](https://composedb.js.org/docs/0.4.x/set-up-your-environment).

1. Start the ComposeDB node by running `npx @ceramicnetwork/cli daemon`. This will also generate a config file for you which we'll use later
2. Create a developer account by first generating a private key with `npx composedb did:generate-private-key`. Make sure to store this key as `DID_PRIVATE_KEY` in `.env.local`
3. Create a DID from you private key by running `npx composedb did:from-private-key <private-key-from-previous-step>`. Store this as `DID_KEY` in `.env.local`
4. Update your ComposeDB config to allow your DID to be admin. Go to `~/.ceramic/daemon.config.json` and add your generated DID to `"http-api"."admin-dids"`. It should look like this:

```json
{
  "http-api": {
    "admin-dids": ["did:key:..."]
    ...
  },
  ...
}
```

5. Restart the node so the updated config
6. Deploy your ComposeDB Model to the node by opening a new terminal and run the script `yarn deploy-models`. You'll have to do this after every change you make to your models.

### dotenv

To pull preset `.env` containing environment variables for local development.

```sh
npx dotenv-vault login
npx dotenv-vault pull
```

## Read More

If you're interested in learning more about Ceramic and ComposeDB you can read the docs here: https://composedb.js.org/
