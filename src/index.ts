import type { Scenes } from 'telegraf'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { Telegraf } from 'telegraf'
import { registerCommands } from './commands'
import { registerMiddlewares } from './middlewares'
import { registerScenes } from './scenes'

const { telegram } = useRuntimeConfig()

export const bot = new Telegraf<Scenes.SceneContext>(
  telegram.botToken,
  telegram.proxyUrl
    ? {
        telegram: {
          agent: new SocksProxyAgent(telegram.proxyUrl),
        },
      }
    : undefined,
)

registerMiddlewares(bot)
registerScenes(bot)
registerCommands(bot)
