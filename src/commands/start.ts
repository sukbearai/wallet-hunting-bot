import type { Context } from 'telegraf';
import { Markup } from 'telegraf'
import { version } from '../utils/version'

export const startCommand = async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.url('主页', 'https://sukbearai.xyz'),
      Markup.button.url('推特X', 'https://x.com/sukbearai')
    ]
  ])

  await ctx.reply(
    `
<b>你好!</b> 👋 我是你的钱包狩猎AI助手！

🚀 版本号：v${version}
    `.trim(),
    {
      parse_mode: 'HTML',
      ...keyboard
    }
  )
}
