import type { FFContext } from '../types'
import { Composer } from 'grammy'

const composer = new Composer<FFContext>()

composer.command('help', async (ctx) => {
  await ctx.reply(`💌联系作者加入社群 sukbearai.xyz`.trim(), {
    parse_mode: 'HTML',
  })
})

export default composer
