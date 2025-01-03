import type { Context } from 'telegraf'
import { startTwitterAuth } from '~/src/twitter/'
import { removeMd } from '../utils/markdown'

export const lotteryCommand = async (ctx: Context) => {
  const twitterManager = await startTwitterAuth()
  const content = await twitterManager.handleTwitterList(
    `1874802804604481951`,
    'lottery',
  )
  await ctx.reply(removeMd(content))
}
