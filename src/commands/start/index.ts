import type { Context } from 'telegraf'
import { Markup } from 'telegraf'
import { getTwitterBase } from '~/src/twitter/'

export const startCommand = async (ctx: Context) => {
  const twitter = await getTwitterBase()

  const listId = `1874371459138937189`
  const TWITTER_LIST_URL = `https://x.com/i/lists/${listId}`
  const AGENT_URL = `https://x.com/0xperi_cat`

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.url('监控列表', TWITTER_LIST_URL),
      Markup.button.url('AI Agent', AGENT_URL),
    ],
  ])
  await ctx.reply(
    `
🚀 监控已启动
⏰ 实时推送中...
    `,
    {
      ...keyboard,
      parse_mode: 'Markdown',
    },
  )

  await twitter.fetchExtractTweetFromList(listId)
}
