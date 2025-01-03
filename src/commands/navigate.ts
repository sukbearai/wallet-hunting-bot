import { type Context, Markup } from 'telegraf'
import { startTwitterAuth } from '~/src/twitter/'

export const navigateCommand = async (ctx: Context) => {
  await startTwitterAuth()
  const TWITTER_LIST_URL = `https://x.com/0xperi_cat/lists`
  const AGENT_URL = `https://x.com/0xperi_cat`

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.url('订阅列表', TWITTER_LIST_URL),
      Markup.button.url('AI Agent', AGENT_URL),
    ],
  ])

  ctx.reply(
    `
<b>嗨～</b> 指令列表：

/lottery:    🧙‍♂️彩票流
/project:   🎄项目方
/industry:  行业领袖
/ai_agent:  AI Agent赛道
/keyword:  关键词搜索
`.trim(),
    {
      ...keyboard,
      parse_mode: 'HTML',
    },
  )
}
