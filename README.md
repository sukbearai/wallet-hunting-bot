<p align="center">
<img src="https://api.iconify.design/fluent-emoji:dog-face.svg" style="width:100px;" />
</p>

<h1 align="center">Wallet Hunting Telegram Bot🤖</h3>

<p align="center">
  Unofficial Telegram bot for <a href="https://bot.sukbearai.xyz">Wallet Hunting Bot</a>
</p>

<br>

A [Nitro](https://nitro.unjs.io) server that serves as an unofficial Telegram bot for [Wallet Hunting Bot](https://bot.sukbearai.xyz). The bot is built using [grammY](https://grammy.dev) and deployed as a serverless function on [Cloudflare Pages](https://pages.cloudflare.com).

## Setup

Create your own Telegram bot using the [BotFather](https://t.me/botfather) and obtain the bot token. Set the bot token as the value of the `TELEGRAM_BOT_TOKEN` environment variable in the `.env` file:

```ini
TELEGRAM_BOT_TOKEN=
```

## Commands

### `/start`

Displays a welcome message and the list of available commands.

### `/suche` or `/search`

Searches for a query on [finanzfluss.de](https://finanzfluss.de) and returns a list of search results. These results are the same as the ones you would get by searching on the website.

### `/advent`

Displays an advent calendar where users can open a door each day in December. The calendar contains various content, which is to be discovered by the users.

Users can only open doors up to the current date in December. If a user tries to open a future door, a message is displayed.

### `/id`

Displays the user ID of the user who sent the command. If the command is a reply to a message, it displays the user ID of the user who sent the message.

### `/help`

Displays the list of available commands.

### Deployment

> [!TIP]
> By default, [grammY](https://grammy.dev) will make a `getMe` call to retrieve the bot information. To avoid this call in a serverless environment, the bot information is pre-fetched at build-time and cached in Niro's runtime configuration. GrammY will use the cached values instead of making a `getMe` call to pre-initialize the bot with cached values.

The deployment [Nitro task](https://nitro.unjs.io/guide/tasks) requires a running Nitro development server. Make sure you start the development server with `pnpm run dev`.

In a separate terminal, run the following command to deploy the worker:

```sh
npx nitro task run telegram:setBot
```

This task will set the outgoing webhook for the Telegram bot. Whenever there is an update for the bot, grammy will automatically handle the update.

## Usage

### Prerequisites

1. Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
2. Install dependencies using `pnpm install`
3. Duplicate `.env.example` and rename it to `.env`

### Development

1. Start the development server using `pnpm run dev`
2. Visit [localhost:3000](http://localhost:3000/)

## License

[MIT](./LICENSE) License © 2024-PRESENT [sukbearai](https://github.com/sukbearai)
