import type { Scenes, Telegraf } from 'telegraf'
import { authMiddleware } from './auth'
import { sessionMiddleware } from './session'

export const registerMiddlewares = (
  bot: Telegraf<Scenes.SceneContext<Scenes.SceneSessionData>>,
) => {
  sessionMiddleware(bot)
  authMiddleware(bot)
}
