import type { Context } from 'telegraf'
import { Markup } from 'telegraf'
import { startTwitterMonitoring } from '~/src/twitter/'

const { twitter } = useRuntimeConfig()

export const startCommand = async (ctx: Context) => {
  await startTwitterMonitoring()

  const listId = twitter.listId
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
}
