import type { Scenes, Telegraf } from 'telegraf'
import { session } from 'telegraf'

export const registerMiddleware = (
  bot: Telegraf<Scenes.SceneContext<Scenes.SceneSessionData>>,
) => {
  bot.use(session())
}
