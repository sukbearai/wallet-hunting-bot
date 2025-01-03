import type { Context } from 'telegraf'
import { startTwitterAuth } from '~/src/twitter/'

export const aiAgentCommand = async (ctx: Context) => {
  const twitterManager = await startTwitterAuth()
  const content = await twitterManager.handleTwitterList(
    `1874802649352241444`,
    'ai_agent',
  )
  await ctx.reply(content)
}
