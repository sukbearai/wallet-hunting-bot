import type { Context } from 'telegraf'
import { startTwitterAuth } from '~/src/twitter/'

export const projectCommand = async (ctx: Context) => {
  const twitterManager = await startTwitterAuth()
  const content = await twitterManager.handleTwitterList(
    `1874914144396427770`,
    'project',
  )
  await ctx.reply(content)
}
