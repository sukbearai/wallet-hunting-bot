import type { FFContext, SessionData } from './types'
import { conversations, createConversation } from '@grammyjs/conversations'
import { Bot, session } from 'grammy'
import { getSocksProxyAgent } from '../../utils'
import { commands as ffCommands } from './commands'
import { conversations as ffConversations } from './conversations'
import { logMiddleware } from './middleware/log'
import { KVStorageAdapter } from './storage/kv-session'

const socksAgent = getSocksProxyAgent()

export function createBot() {
  const { telegram } = useRuntimeConfig()
  const bot = new Bot<FFContext>(telegram.botToken, {
    botInfo: telegram.botInfo,
    client: {
      baseFetchConfig: {
        agent: socksAgent,
        compress: true,
      },
    },
  })

  bot.use(
    session({
      storage: new KVStorageAdapter<SessionData>(),
      initial: () => ({ adventScore: 0, answeredDays: [] }),
    }),
  )
  bot.use(conversations())

  if (import.meta.dev) {
    logMiddleware(bot)
  }

  bot.use(
    ...Object.entries(ffConversations).map(([name, cb]) =>
      createConversation(cb, name),
    ),
  )
  bot.use(ffCommands)

  return bot
}
