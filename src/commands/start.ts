import type { Context } from 'telegraf'
import { startTwitterAuth } from '~/src/twitter/'

export const startCommand = async (ctx: Context) => {
  const twitterManager = await startTwitterAuth()
  const profile = twitterManager.profile

  if (profile) {
    await ctx.replyWithMediaGroup([
      {
        type: 'photo',
        media: profile.banner,
        caption: `
<b>推特情报员已启动</b>
<code>
名字：${profile.screenName}
签名：${profile.bio}
</code>
`.trim(),
        parse_mode: 'HTML',
      },
    ])
  } else {
    await ctx.reply(`授权失败`)
  }
}
