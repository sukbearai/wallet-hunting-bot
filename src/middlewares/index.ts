import type { Scenes, Telegraf } from 'telegraf'
import { session } from 'telegraf'

export const registerMiddlewares = (
  bot: Telegraf<Scenes.SceneContext<Scenes.SceneSessionData>>,
) => {
  bot.use(session())
}
