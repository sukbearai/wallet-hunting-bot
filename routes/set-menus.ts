import { bot } from '../src'

export default eventHandler(async () => {
  bot.telegram.setMyCommands([
    {
      command: '/start',
      description: '开始',
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
