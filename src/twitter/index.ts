import { TwitterBase } from './base'
import { validateTwitterConfig } from './environment'

export async function getTwitterBase() {
  const config = await validateTwitterConfig()
  const twitterBase = new TwitterBase(config)
  await twitterBase.init()

  return twitterBase
}
