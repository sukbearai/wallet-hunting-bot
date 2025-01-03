import type { Context } from 'telegraf'
import { startTwitterAuth } from '~/src/twitter/'
import { escapeMarkdownV2 } from '../utils/markdown'

export const industryCommand = async (ctx: Context) => {
  const twitterManager = await startTwitterAuth()
  const content = await twitterManager.handleTwitterList(
    `1874371459138937189`,
    'industry',
  )
  await ctx.reply(escapeMarkdownV2(content), { parse_mode: 'MarkdownV2' })
}
