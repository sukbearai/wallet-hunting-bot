import type { FFContext } from '../types'
import { Composer } from 'grammy'

const composer = new Composer<FFContext>()

composer.command('advent', async (ctx) => {
  await ctx.conversation.enter('adventGame')
})

export default composer
