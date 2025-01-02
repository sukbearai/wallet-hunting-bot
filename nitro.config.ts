import process from 'node:process'
import 'dotenv/config'

export default defineNitroConfig({
  runtimeConfig: {
    telegram: {
      botToken: process.env.BOT_TOKEN,
      authToken: process.env.TOKEN,
      proxyUrl: process.env.TELEGRAM_PROXY_URL,
    },
    twitter: {
      username: process.env.TWITTER_USERNAME,
      password: process.env.TWITTER_PASSWORD,
      email: process.env.TWITTER_EMAIL,
      twoFactorSecret: process.env.TWITTER_2FA_SECRET,
      apiKey: process.env.TWITTER_API_KEY,
      apiSecretKey: process.env.TWITTER_API_SECRET_KEY,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      proxyUrl: process.env.TWITTER_PROXY_URL,
      retryLimit: process.env.TWITTER_RETRY_LIMIT,
      dryRun: process.env.TWITTER_DRY_RUN,
      maxTweetLength: process.env.MAX_TWEET_LENGTH,
      searchEnable: process.env.TWITTER_SEARCH_ENABLE,
      pollInterval: process.env.TWITTER_POLL_INTERVAL,
      targetUsers: process.env.TWITTER_TARGET_USERS,
      postIntervalMin: process.env.POST_INTERVAL_MIN,
      postIntervalMax: process.env.POST_INTERVAL_MAX,
      enableActionProcessing: process.env.ENABLE_ACTION_PROCESSING,
      actionInterval: process.env.ACTION_INTERVAL,
      postImmediately: process.env.POST_IMMEDIATELY,
      listId: process.env.TWITTER_LIST_ID,
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

  // preset: 'cloudflare-pages',

  experimental: {
    tasks: true,
    asyncContext: true,
  },
})
