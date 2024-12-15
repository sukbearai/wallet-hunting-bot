import type { FFContext } from '../types'
import { Composer } from 'grammy'

const composer = new Composer<FFContext>()

composer.command('id', async (ctx) => {
  if (ctx.message?.reply_to_message?.from?.id) {
    const { id, first_name } = ctx.message.reply_to_message.from
    await ctx.reply(`<b>${first_name}'s ID:</b> <code>${id}</code>`, {
      parse_mode: 'HTML',
    })
    return
  }

  await ctx.reply(
    `
<b>User-ID:</b> <code>${ctx.from?.id}</code>
${
  ctx.message?.chat.type !== 'private'
    ? `<b>Chat-ID:</b> <code>${ctx.message?.chat.id}</code>`
    : ''
}
`.trim(),
    { parse_mode: 'HTML' },
  )
})

export default composer
