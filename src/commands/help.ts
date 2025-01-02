import type { Context  } from 'telegraf'
import { Markup } from 'telegraf'

export const helpCommand = async (ctx: Context) => {
  const shareText = '请点击下方🔗查看bot文档:'
  const shareUrl = 'https://docs.qq.com/doc/DT09qdmNTWmtCRU1X'
  
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('腾讯文档', shareUrl)]
  ])

  await ctx.reply(shareText, keyboard)
}
