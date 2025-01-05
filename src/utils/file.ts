import type { Tweet } from 'agent-twitter-client'
import * as fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { consola } from './log'
import { uploadToAliOss } from './oss'
import { stringToUuid } from './uuid'

type ProcessedTweet = Omit<Tweet, 'photos' | 'videos'> & {
  photos?: Tweet['photos']
  videos?: Tweet['videos']
}

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

  // token limit
  const filteredTweets = filterTweetsByTokenLimit(
    filterTodayTweets(tweetsArray),
  )

  const tweetsTxtContent = `[${filteredTweets
    .map((tweet) => {
      return JSON.stringify(tweet)
    })
    .join(',')}]`

  fs.appendFileSync(logFile, tweetsTxtContent)

  const ossUrl = await uploadToAliOss(logFile, filePrefix)

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

function filterTweetsByTokenLimit(
  tweets: ProcessedTweet[],
  maxTokens: number = 128000,
): ProcessedTweet[] {
  let totalTokens = 0

  const totalContent = JSON.stringify(tweets)
  totalTokens = estimateTokens(totalContent)

  if (totalTokens <= maxTokens) {
    return tweets
  }

  consola.warn(
    `The total tokens of tweets is ${totalTokens}, exceed the limit ${maxTokens}`,
  )
  return tweets
    .map((tweet) => {
      const processedTweet = { ...tweet }
      delete processedTweet.photos
      delete processedTweet.videos
      return processedTweet
    })
    .slice(0, 200)
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 1)
}
