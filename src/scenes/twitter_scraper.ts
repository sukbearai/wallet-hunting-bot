import { Scenes } from 'telegraf'

export const twitterScraper = new Scenes.BaseScene<Scenes.SceneContext>('twitter_scraper')

twitterScraper.enter(async (ctx) => {
  await ctx.reply('请输入推特ID:')
})

twitterScraper.on('text', async (ctx) => {
  const twitterId = ctx.message.text
  await ctx.reply(`收到推特ID: ${twitterId}, 开始处理...`)
  // TODO: 处理推特逻辑
  await ctx.scene.leave()
})

