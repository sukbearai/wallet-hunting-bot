import { Scenes } from 'telegraf'
import { startTwitterAuth } from '~/src/twitter/'
import { removeMd } from '../utils/markdown'

export const keywordScene = new Scenes.BaseScene<Scenes.SceneContext>(
  'keyword_scene',
)

keywordScene.enter(async (ctx) => {
  await ctx.reply('请输入关键字')
})

keywordScene.on('text', async (ctx) => {
  const twitterManager = await startTwitterAuth()
  const msg = ctx.message.text

  const content = await twitterManager.handleTwitterSearchList(msg, 'keyword')
  await ctx.reply(removeMd(content))
  await ctx.scene.leave()
})
