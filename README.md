# Sky Strife League

This is an example of creating an alternative Sky Strife client that also utilizes custom contracts deployed to a Sky Strife MUD world. This currently points to the latest world deployed to Redstone as part of the Season 0 playtest.

## Dev Setup

1. `git clone` this repository.
2. Run `pnpm install` in the base directory to install all dependencies.
3. Run `pnpm dev` to start the client.
4. Go to `localhost:3000`.

## Deploying the League

1. Change the MUD `namespace` that you will deploy to.
  - Change the `namespace` key in `packages/contracts/mud.config.ts`.
2. Add your private key to the `.env` file in `packages/contracts`.
  - Run `cp packages/contracts/.env.example packages/contracts/.env` to create the `.env` file.
3. Run `pnpm deploy:redstone` inside the `packages/contracts` directory.
4. Run `post-deploy:redstone` inside the `packages/contracts` directory.
  - This sets yourself as the `Organizer` of the League and gives you the ability to add league matches and other organizers.
5. Commit and push your changes to the `main` branch.
6. Deploy the client using the deploy to Vercel button.

