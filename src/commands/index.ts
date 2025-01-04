import type { Context, Scenes, Telegraf } from 'telegraf'
import { aiAgentCommand } from './ai_agent'
import { industryCommand } from './industry'
import { lotteryCommand } from './lottery'
import { navigateCommand } from './navigate'
import { projectCommand } from './project'
import { startCommand } from './start'

const commands: Record<string, (ctx: Context) => Promise<void> | void> = {
  start: startCommand,
  navigate: navigateCommand,
  lottery: lotteryCommand,
  project: projectCommand,
  industry: industryCommand,
  ai_agent: aiAgentCommand,
  keyword: (ctx: any) => ctx.scene.enter('keyword_scene'),
  kol: (ctx: any) => ctx.scene.enter('kol_scene'),
}

export const registerCommands = (
  bot: Telegraf<Scenes.SceneContext<Scenes.SceneSessionData>>,
) => {
  Object.entries(commands).forEach(([command, handler]) => {
    bot.command(command, handler)
  })
}
