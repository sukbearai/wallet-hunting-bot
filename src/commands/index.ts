import type { Context, Scenes, Telegraf } from 'telegraf'
import { aiAgentCommand } from './ai_agent'
import { industryCommand } from './industry'
import { lotteryCommand } from './lottery'
import { navigateCommand } from './navigate'
import { projectCommand } from './project'
import { startCommand } from './start'

const commands: Record<string, (ctx: Context) => Promise<void> | void> = {
  // twitter_scraper: (ctx: any) => ctx.scene.enter('twitter_scraper'),
  start: startCommand,
  navigate: navigateCommand,
  ai_agent: aiAgentCommand,
  industry: industryCommand,
  lottery: lotteryCommand,
  project: projectCommand,
}

export const registerCommands = (
  bot: Telegraf<Scenes.SceneContext<Scenes.SceneSessionData>>,
) => {
  Object.entries(commands).forEach(([command, handler]) => {
    bot.command(command, handler)
  })
}
