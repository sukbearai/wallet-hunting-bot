import { bot } from '../src'

export default eventHandler(async () => {
  await bot.telegram.setMyCommands([
    {
      command: '/start',
      description: '开始',
    },
    {
      command: '/navigate',
      description: '指令集',
    },
  ])
  return 'OK'
})
