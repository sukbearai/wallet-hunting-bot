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
    // {
    //   command: '/help',
    //   description: '帮助',
    // },
    // {
    //   command: '/twitter_scraper',
    //   description: '推特刮刀',
    // },
  ])
  return 'OK'
})
