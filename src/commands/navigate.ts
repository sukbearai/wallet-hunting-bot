import { type Context, Markup } from 'telegraf'

export const navigateCommand = async (ctx: Context) => {
  const TWITTER_LIST_URL = `https://x.com/0xperi_cat/lists`
  const AGENT_URL = `https://x.com/0xperi_cat`

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.url('订阅列表', TWITTER_LIST_URL),
      Markup.button.url('推特', AGENT_URL),
    ],
  ])

  ctx.reply(
    `
<b>嗨～</b> 指令列表：

/lottery${'\u2002'.repeat(6)}🧙‍♂️彩票流
/project${'\u2002'.repeat(6)}🎄项目方
/industry${'\u2002'.repeat(5)}行业领袖
/ai_agent${'\u2002'.repeat(5)}AI Agent赛道
/keyword${'\u2002'.repeat(5)}关键词搜索
    `.trim(),
    {
      ...keyboard,
      parse_mode: 'HTML',
    },
  )
}
