# web

## Local Development

1. Setup environment variables (`cp .env.local.example .env.local`)
2. Run the local developer environment with `yarn dev` (or `yarn dev --filter web` from root directory)

### dotenv

To pull preset `.env` containing environment variables for local development.

```sh
npx dotenv-vault login
npx dotenv-vault pull
```

## Adding a command

> ⚠️ NOTE: This is very subject to change in order to improve developer experience

If you want to contribute with your own `/command`, you can follow these steps:

1. Fork repository
2. Create new folder in `apps/web/components/commands` with the name of your command
3. Add the following files:
   - `command.ts` which adheres to the `CommandConfiguration`. Make sure the command name is unique
   - `icon.png/svg/jpg` which will be used in the command list dropdown
   - The react component which will render the data. It should be named `Component.tsx` or the name of the integration. Check current components for examples
4. Update the `commands.ts` to include the command and put it in an appropriate group
5. Verify your command works in the editor
6. Submit PR when you feel confident
