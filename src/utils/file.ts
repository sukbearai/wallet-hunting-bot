import type { Tweet } from 'agent-twitter-client'
import * as fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { consola } from './log'
import { uploadToAliOss } from './oss'
import { stringToUuid } from './uuid'

export const getCurrentDir = () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  return __dirname
}

const filterTodayTweets = (tweets: Tweet[]) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTimestamp = Math.floor(today.getTime() / 1000) // 转换为秒

  return tweets.filter(
    (tweet) => tweet.timestamp && tweet.timestamp >= todayTimestamp,
  )
}

export async function writeTweetsTxt(
  tweets: Tweet[] | Tweet,
  filePrefix: string,
) {
  const logPath = `./upload/${filePrefix}`
  const fileName = stringToUuid(new Date().getTime())
  const logFile = `${logPath}/${fileName}.txt`

  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true })
  }

  const tweetsArray = Array.isArray(tweets) ? tweets : [tweets]

  const logEntries = filterTodayTweets(tweetsArray)
    .map((tweet) => {
      return `${JSON.stringify(tweet)}`
    })
    .join('')

  fs.appendFileSync(logFile, logEntries)

  const ossUrl = await uploadToAliOss(logFile, filePrefix)

  // const url = `${telegram.tunnelUrl}${logFile.replace(/^\./, '')}`
  // const url = `${telegram.tunnelUrl}/fastgpt/file/${filePrefix}/${fileName}.txt`

  // if (!import.meta.dev) {
  //   const rootDir = path.resolve(getCurrentDir(), '../../')
  //   const srcDir = path.join(rootDir, 'public')
  //   const destDir = path.join(rootDir, '.output/public')
  //   copyDirSync(srcDir, destDir)
  //   consola.log(`The output/public directory was successfully replaced ${url}`)
  // }
  consola.log(`The file has been uploaded ${ossUrl}`)
  return ossUrl
}

function deleteDirectoryRecursive(dir: string) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file)
      if (fs.statSync(curPath).isDirectory()) {
        deleteDirectoryRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dir)
  }
}

export function copyDirSync(src: string, dest: string) {
  deleteDirectoryRecursive(dest)

  fs.mkdirSync(dest, { recursive: true })

  const files = fs.readdirSync(src)

  files.forEach((file) => {
    const srcPath = path.join(src, file)
    const destPath = path.join(dest, file)

    const stat = fs.statSync(srcPath)

    if (stat.isDirectory()) {
      copyDirSync(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  })
}
