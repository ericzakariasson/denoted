# ceramic

## Local Development


This is a short version of running a local development, please read the official documentation if it doesn't work [here](https://composedb.js.org/docs/0.4.x/set-up-your-environment).

### Compose DB
1. Start the ComposeDB node by running `npx @ceramicnetwork/cli daemon`. This will also generate a config file for you which we'll use later. If the terminal shows that `Ceramic API is running on 0.0.0.0:xxxx` then you're set.
>**_NOTE:_** If this doesn't work you might need to delete your `.ceramic` directory. Run `rm -rf ~/.ceramic` and try step 1 again.
2. Go to your `.env`. If you have a `DID_PRIVATE_KEY` and `DID_KEY` you can skip step 3 and 4.
3. Create a developer account by first generating a private key with `npx composedb did:generate-private-key`. Make sure to store this key as `DID_PRIVATE_KEY` in `.env.local`
4. Create a DID from you private key by running `npx composedb did:from-private-key <private-key-from-previous-step>`. Store this as `DID_KEY` in `.env.local`
5. Update your ComposeDB config to allow your DID to be admin. Go to `~/.ceramic/daemon.config.json` and add your generated DID to `"http-api"."admin-dids"`. It should look like this:

```json
{
  "http-api": {
    "admin-dids": ["did:key:..."]
    ...
  },
  ...
}
```

6. Restart the node with the updated config (run `npx @ceramicnetwork/cli daemon` again).
7. Deploy your ComposeDB Model to the node by opening a new terminal and run the script `yarn deploy-models`. You'll have to do this after every change you make to your models.

### dotenv

To pull preset `.env` containing environment variables for local development.

```sh
npx dotenv-vault login
npx dotenv-vault pull
```

## Read More

If you're interested in learning more about Ceramic and ComposeDB you can read the docs here: https://composedb.js.org/
