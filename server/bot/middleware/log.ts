import type { Bot } from 'grammy'
import type { FFContext } from '../types'

export function logMiddleware(bot: Bot<FFContext>) {
  bot.use(async (ctx, next) => {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ ctx.session:logMiddleware', ctx.session)
    await next()
  })
}
