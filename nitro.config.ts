import process from 'node:process'
import 'dotenv/config'
import './validation'

export default defineNitroConfig({
  srcDir: 'server',

  runtimeConfig: {
    site: {
      url:
        process.env.NODE_ENV !== 'production'
          ? 'https://tunnels.sukbearai.xyz'
          : 'https://bot.sukbearai.xyz',
    },

    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      botInfo: JSON.parse(
        process.env.NITRO_PREPARE === 'true'
          ? '{}'
          : process.env.TELEGRAM_BOT_INFO,
      ),
    },

    webhookToken: process.env.WEBHOOK_SECRET,
  },

  storage: {
    kv: {
      driver: 'cloudflareKVBinding',
      binding: 'KV',
    },
  },
  devStorage: {
    kv: {
      driver: 'fs',
      base: '.data/kv',
    },
  },

  experimental: {
    tasks: process.env.NITRO_PRESET === undefined,
    asyncContext: true,
  },

  preset: 'cloudflare-pages',
})
