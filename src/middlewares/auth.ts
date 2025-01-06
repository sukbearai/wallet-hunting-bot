import type { Scenes, Telegraf } from 'telegraf'
import { consola } from '../utils/log'

const { telegram } = useRuntimeConfig()

export function authMiddleware(
  bot: Telegraf<Scenes.SceneContext<Scenes.SceneSessionData>>,
) {
  bot.use((ctx, next) => {
    consola.log(ctx.from?.id === Number(telegram.userId))
    if (ctx.from?.id === Number(telegram.userId)) {
      return next()
    }
    return ctx.reply('You are not authorized to use this bot')
  })
}
