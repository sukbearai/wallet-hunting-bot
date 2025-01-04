import type { Telegraf } from 'telegraf'
import { Scenes } from 'telegraf'
import { keywordScene } from './keyword'
import { kolScene } from './kol'

const stage = new Scenes.Stage<Scenes.SceneContext>([keywordScene, kolScene])

export const registerScenes = (
  bot: Telegraf<Scenes.SceneContext<Scenes.SceneSessionData>>,
) => {
  bot.use(stage.middleware())
}
