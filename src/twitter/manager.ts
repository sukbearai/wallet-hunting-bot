import type { Tweet } from 'agent-twitter-client'
import type { APIResponse } from '../types'
import type { TwitterConfig } from './environment'
import * as fs from 'node:fs'
import { Scraper, SearchMode } from 'agent-twitter-client'
import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { generateCookiesFile } from '~/src/utils/cookies'
import { writeTweetsTxt } from '~/src/utils/file'
import { consola } from '~/src/utils/log'
import { RequestQueue } from './queue'

interface TwitterProfile {
  id: string
  username: string
  screenName: string
  bio: string
  banner: string
}

export class TwitterManager {
  static _twitterClients: { [accountIdentifier: string]: Scraper } = {}
  twitterClient: Scraper
  requestQueue: RequestQueue = new RequestQueue()
  twitterConfig: TwitterConfig
  profile: TwitterProfile | null = null
  private isMonitoring: boolean = false
  private timeoutId: NodeJS.Timeout | null = null

  constructor(twitterConfig: TwitterConfig) {
    this.twitterConfig = twitterConfig
    const username = twitterConfig.TWITTER_USERNAME
    this.twitterClient = this.getProxyScraper()
    if (TwitterManager._twitterClients[username]) {
      this.twitterClient = TwitterManager._twitterClients[username]
    } else {
      this.twitterClient = this.getProxyScraper()
      TwitterManager._twitterClients[username] = this.twitterClient
    }
  }

  async init() {
    const username = this.twitterConfig.TWITTER_USERNAME
    const password = this.twitterConfig.TWITTER_PASSWORD
    const email = this.twitterConfig.TWITTER_EMAIL
    let retries = this.twitterConfig.TWITTER_RETRY_LIMIT
    const twitter2faSecret = this.twitterConfig.TWITTER_2FA_SECRET

    if (!username) {
      throw new Error('Twitter username not configured')
    }

    const cachedCookies = await this.getCachedCookies()

    if (cachedCookies) {
      consola.info('Using cached cookies')
      await this.setCookiesFromArray(cachedCookies)
    }

    consola.log('Waiting for Twitter login')
    while (retries > 0) {
      try {
        if (await this.twitterClient.isLoggedIn()) {
          // cookies are valid, no login required
          consola.info('Successfully logged in. 🍪')
          break
        } else {
          await this.twitterClient.login(
            username,
            password,
            email,
            twitter2faSecret,
          )
          if (await this.twitterClient.isLoggedIn()) {
            // fresh login, store new cookies
            consola.info('Successfully logged in. 🚀')
            consola.info('Caching cookies')
            await generateCookiesFile(await this.twitterClient.getCookies())
            break
          }
        }
      } catch (error: any) {
        consola.error(`Login attempt failed: ${error.message}`)
      }

      retries--
      consola.error(
        `Failed to login to Twitter. Retrying... (${retries} attempts left)`,
      )

      if (retries === 0) {
        consola.error('Max retries reached. Exiting login process.')
        throw new Error('Twitter login failed after maximum retries.')
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    this.profile = await this.fetchProfile(username)

    if (this.profile) {
      consola.info('Twitter user ID:', this.profile.id)
      consola.info('Twitter loaded:', JSON.stringify(this.profile, null, 10))
    } else {
      throw new Error('Failed to load profile')
    }
  }

  async getCachedCookies() {
    let cookiesArray: any = null
    if (!fs.existsSync('./cookies.json')) {
      consola.error(
        'cookies.json not found, using password auth - this is NOT recommended!',
      )
    } else {
      try {
        const cookiesText = fs.readFileSync('./cookies.json', 'utf8')
        cookiesArray = JSON.parse(cookiesText)
      } catch (e) {
        console.error('Error parsing cookies.json', e)
      }
    }
    return cookiesArray
  }

  async setCookiesFromArray(cookiesArray: any[]) {
    try {
      const cookieStrings = cookiesArray.map(
        (cookie) =>
          `${cookie.key}=${cookie.value}; Domain=${cookie.domain}; Path=${cookie.path}; ${
            cookie.secure ? 'Secure' : ''
          }; ${cookie.httpOnly ? 'HttpOnly' : ''}; SameSite=${
            cookie.sameSite || 'Lax'
          }`,
      )
      await this.twitterClient.setCookies(cookieStrings)
    } catch (error) {
      console.error('Error setting cookies', error)
      throw error
    }
  }

  getProxyScraper() {
    const proxyUrl = this.twitterConfig.TWITTER_PROXY_URL
    let agent: any

    if (proxyUrl) {
      // Parse the proxy URL
      const url = new URL(proxyUrl)
      const username = url.username
      const password = url.password

      // Strip auth from URL if present
      url.username = ''
      url.password = ''

      const agentOptions: any = {
        uri: url.toString(),
        requestTls: {
          rejectUnauthorized: false,
        },
      }

      // Add Basic auth if credentials exist
      if (username && password) {
        // eslint-disable-next-line node/prefer-global/buffer
        agentOptions.token = `Basic ${Buffer.from(
          `${username}:${password}`,
        ).toString('base64')}`
      }
      agent = new ProxyAgent(agentOptions)

      // Set the global dispatcher to the agent
      setGlobalDispatcher(agent)
    }

    const scraper = new Scraper({
      transform: {
        request: (input: any, init: any) => {
          if (agent) {
            return [input, { ...init, dispatcher: agent }]
          }
          return [input, init]
        },
      },
    })

    return scraper
  }

  async handleTwitterList(listId: string, filePrefix: string) {
    try {
      consola.log(`searching Twitter for  ${filePrefix}`)
      const listTweets = await this.requestQueue.add(async () =>
        this.twitterClient.fetchListTweets(listId, 300),
      )

      const content = await this.fetchGptSummarizeTweets(
        await writeTweetsTxt(listTweets.tweets, filePrefix),
      )
      return content
    } catch (error) {
      consola.error(`Error handling Twitter list ${listId}:`, error)
      return ''
    }
  }

  async handleTwitterSearchList(keyword: string, filePrefix: string) {
    try {
      consola.log(`searching Twitter for  ${keyword}`)
      const searchTweets = await this.requestQueue.add(async () =>
        this.twitterClient.fetchSearchTweets(keyword, 300, SearchMode.Top),
      )

      const content = await this.fetchGptSummarizeTweets(
        await writeTweetsTxt(searchTweets.tweets, filePrefix),
      )
      return content
    } catch (error) {
      consola.error(`Error searching Twitter for ${keyword}:`, error)
      return ''
    }
  }

  async handleTwitterKolList(kol: string, filePrefix: string) {
    try {
      consola.log(`searching Twitter for  ${kol}`)

      const tweets: Tweet[] = []
      const generator = await this.requestQueue.add(async () =>
        this.twitterClient.getTweetsAndReplies(kol, 300),
      )

      for await (const tweet of generator) {
        tweets.push(tweet)
      }

      consola.log(`Collected ${tweets.length} tweets from ${kol}`)
      const content = await this.fetchGptSummarizeTweets(
        await writeTweetsTxt(tweets, filePrefix),
      )
      return content
    } catch (error) {
      consola.error(`Error handling Twitter KOL ${kol}:`, error)
      return ''
    }
  }

  async fetchGptSummarizeTweets(fileUrl: string) {
    try {
      const summarizeResult = await this.requestQueue.add(async () => {
        const gptSummarizeTweets = await $fetch<APIResponse>(
          `/fastgpt/summarize/${encodeURIComponent(fileUrl)}`,
        )
        return (
          gptSummarizeTweets.choices[0].message.content ||
          'AI summarization failed'
        )
      })
      return summarizeResult
    } catch (error) {
      consola.error(`Error AI summarizing tweets from ${fileUrl}:`, error)
      return ''
    }
  }

  async fetchProfile(username: string): Promise<TwitterProfile | null> {
    try {
      const profile = await this.requestQueue.add(async () => {
        const profile = await this.twitterClient.getProfile(username)
        // console.log({ profile });
        return {
          id: profile.userId!,
          username,
          screenName: profile.name!,
          bio: profile.biography!,
          banner: profile.banner!,
        } satisfies TwitterProfile
      })

      return profile
    } catch (error) {
      console.error('Error fetching Twitter profile:', error)

      return null
    }
  }

  async fetchOwnPosts(count: number): Promise<Tweet[]> {
    try {
      consola.debug('fetching own posts')
      const homeTimeline = await this.twitterClient.getUserTweets(
        this.profile!.id,
        count,
      )
      return homeTimeline.tweets
    } catch (error) {
      consola.error('Error fetching own posts:', error)
      return []
    }
  }

  async startMonitoringPoll(listId: string, filePrefix: string) {
    this.isMonitoring = true
    const handleTwitterInteractionsLoop = async () => {
      if (!this.isMonitoring) return

      try {
        await this.handleTwitterList(listId, filePrefix)
      } catch (error) {
        consola.error('Error in monitoring poll:', error)
      }

      this.timeoutId = setTimeout(
        handleTwitterInteractionsLoop,
        this.twitterConfig.TWITTER_POLL_INTERVAL * 1000,
      )
    }
    handleTwitterInteractionsLoop()
  }

  stopMonitoringPoll() {
    this.isMonitoring = false
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}
