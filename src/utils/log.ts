import * as fs from 'node:fs'
import { formatDate } from './date'
export { consola, createConsola } from 'consola'

export function writeTweetsLog(tweets: any[] | any) {
  // 使用绝对路径
  const logPath = './logs'
  const fileName = formatDate(`${new Date()}`).formatted
  const logFile = `${logPath}/${fileName}.txt`

  // 确保日志目录存在
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true })
  }

  const timestamp = formatDate(`${new Date()}`).formatted

  // 处理单个推文或推文数组
  const tweetsArray = Array.isArray(tweets) ? tweets : [tweets]

  // 组装日志内容
  const logEntries = tweetsArray
    .map((tweet) => {
      const logContent = JSON.stringify(tweet, null, 2)
      return [
        '\n',
        `=== ${timestamp} ===`,
        '\n',
        logContent,
        '\n',
        '-------------------', // 添加分隔线
        '\n',
      ].join('')
    })
    .join('')

  // 写入文件
  fs.appendFileSync(logFile, logEntries)
}
