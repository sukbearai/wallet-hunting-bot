import process from 'node:process'
import 'dotenv/config'

export default defineNitroConfig({
  runtimeConfig: {
    telegram: {
      botToken: process.env.BOT_TOKEN,
      authToken: process.env.TOKEN,
    },
  },

  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        module: 'preserve',
        noEmit: true,
        moduleDetection: 'force',
        isolatedModules: true,
        skipLibCheck: true,
      },
    },
  },

  compatibilityDate: '2024-11-22',

  preset: 'cloudflare-pages',

  experimental: {
    tasks: true,
    asyncContext: true,
  },
})
