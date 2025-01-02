import { TwitterManager } from './base'
import { validateTwitterConfig } from './environment'

export async function startTwitterMonitoring() {
  const config = await validateTwitterConfig()
  const twitterManager = new TwitterManager(config)
  await twitterManager.init()
}
