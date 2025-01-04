import { Scenes } from 'telegraf'
import { startTwitterAuth } from '~/src/twitter/'
import { cleanMarkdown } from '../utils/markdown'

export const kolScene = new Scenes.BaseScene<Scenes.SceneContext>('kol_scene')

kolScene.enter(async (ctx) => {
  await ctx.reply('请输入kol推特名')
})

kolScene.on('text', async (ctx) => {
  const twitterManager = await startTwitterAuth()
  const msg = ctx.message.text

  const content = await twitterManager.handleTwitterKolList(msg, 'kol')
  await ctx.reply(cleanMarkdown(content))
  await ctx.scene.leave()
})
