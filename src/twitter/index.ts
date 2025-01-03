import { validateTwitterConfig } from './environment'
import { TwitterManager } from './manager'

export async function startTwitterAuth() {
  const config = await validateTwitterConfig()
  const twitterManager = new TwitterManager(config)
  await twitterManager.init()
  return twitterManager
}
