import { SocksProxyAgent } from 'socks-proxy-agent'
import { Scenes, session, Telegraf } from 'telegraf'
import { registerCommands } from './commands'
import { twitterScraper } from './scenes/twitter_scraper'

const { telegram } = useRuntimeConfig()

export const bot = new Telegraf<Scenes.SceneContext>(telegram.botToken, {
  telegram: {
    agent: new SocksProxyAgent(telegram.proxyUrl),
  },
})

const stage = new Scenes.Stage<Scenes.SceneContext>([twitterScraper])

bot.use(session())
bot.use(stage.middleware())
registerCommands(bot)
