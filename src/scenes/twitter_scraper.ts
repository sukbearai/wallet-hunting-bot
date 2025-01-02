import { Scenes } from 'telegraf'

export const twitterScraper = new Scenes.BaseScene<Scenes.SceneContext>(
  'twitter_scraper',
)

twitterScraper.enter(async (ctx) => {
  await ctx.reply('请输入推特号，如@elonmusk')
})

twitterScraper.on('text', async (ctx) => {
  const msg = ctx.message.text
  switch (msg) {
    case '@elonmusk':
      await ctx.reply('https://twitter.com/elonmusk')
      twitterScraperMiddleware()
      break
    case '@VitalikButerin':
      await ctx.reply('https://twitter.com/VitalikButerin')
      twitterScraperMiddleware()
      break
    default:
      await ctx.reply('未找到该用户')
      break
  }
  // TODO: 处理推特逻辑
  await ctx.scene.leave()
})

async function twitterScraperMiddleware() {
  // ...
}
