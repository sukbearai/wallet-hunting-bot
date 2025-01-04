import type { Scenes } from 'telegraf'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { Telegraf } from 'telegraf'
import { registerCommands } from './commands'
import { registerMiddleware } from './middleware'
import { registerScenes } from './scenes'

const { telegram } = useRuntimeConfig()

export const bot = new Telegraf<Scenes.SceneContext>(telegram.botToken, {
  telegram: {
    agent: new SocksProxyAgent(telegram.proxyUrl),
  },
})

registerMiddleware(bot)
registerScenes(bot)
registerCommands(bot)
