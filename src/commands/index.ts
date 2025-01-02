import type { Context, Scenes, Telegraf } from 'telegraf'
import { helpCommand } from './help'
import { startCommand } from './start/'

const commands: Record<string, (ctx: Context) => Promise<void> | void> = {
  help: helpCommand,
  start: startCommand,
  twitter_scraper: (ctx: any) => ctx.scene.enter('twitter_scraper'),
}

export const registerCommands = (
  bot: Telegraf<Scenes.SceneContext<Scenes.SceneSessionData>>,
) => {
  Object.entries(commands).forEach(([command, handler]) => {
    bot.command(command, handler)
  })
}
