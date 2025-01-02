import { validateTwitterConfig } from './environment'
import { TwitterManager } from './manager'

export async function startTwitterMonitoring() {
  const config = await validateTwitterConfig()
  const twitterManager = new TwitterManager(config)
  await twitterManager.init()
  // await twitterManager.startMonitoringPoll()
  await twitterManager.startMonitoringOnce()
}
