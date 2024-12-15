import type { FFContext } from '../types'
import { Composer } from 'grammy'

const composer = new Composer<FFContext>()

composer.command('advent_teilen', async (ctx) => {
  const shareText = '🎄 Teile den großen Finanzfluss Adventskalender 2024:'
  const shareUrl = 'https://t.me/wallet_hunting_bot?start=advent'
  await ctx.reply(shareText, {
    reply_markup: {
      inline_keyboard: [[{ text: 'Link teilen', url: shareUrl }]],
    },
  })
})

export default composer
