import type { Scenes, Telegraf } from 'telegraf'
import { session } from 'telegraf'

export function sessionMiddleware(
  bot: Telegraf<Scenes.SceneContext<Scenes.SceneSessionData>>,
) {
  bot.use(session())
}
