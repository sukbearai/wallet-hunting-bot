import type { FFContext } from '../types'
import { Composer, InlineKeyboard } from 'grammy'

const composer = new Composer<FFContext>()

composer.command('start', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .url('Wallet Hunting Bot', 'https://bot.sukbearai.xyz')
    .url('推特', 'https://x.com/sukbearai')

  await ctx.reply(
    `
<b>你好!</b> 👋 我是你的加密钱包狩猎AI助手！

🚀 轻松探索 Web3，把握投资先机！

我能帮你：
- 🕵️‍♂️ 实时追踪Degen和聪明钱的动向。
- 🔥 推送热门Token，让你把握投资先机。
- 📈 监控市场动态，不错过任何机会。

请点击👇指令开始探索：
/start: 开始探索Web3✨.
/help:  获取帮助💬.
`.trim(),
    {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    },
  )
})

export default composer
