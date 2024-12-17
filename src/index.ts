import { SocksProxyAgent } from 'socks-proxy-agent'
import { Scenes, session, Telegraf } from 'telegraf'
import { registerCommands } from './commands'
import { twitterScraper } from './scenes/twitter_scraper'

const { telegram } = useRuntimeConfig()

export const bot = new Telegraf<Scenes.SceneContext>(telegram.botToken, {
  telegram: {
    ...(import.meta.dev && {
      agent: new SocksProxyAgent('socks5://127.0.0.1:7890'),
    }),
  },
})

const stage = new Scenes.Stage<Scenes.SceneContext>([twitterScraper])

bot.use(session())
bot.use(stage.middleware())
registerCommands(bot)
