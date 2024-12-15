import { joinURL } from 'ufo'
import { createBot } from '~/bot'

export default defineTask({
  meta: {
    name: 'telegram:setBot',
    description: 'Sets the webhook for the wallet_hunting_bot Telegram bot',
  },
  async run(_ctx) {
    const { site, webhookToken } = useRuntimeConfig()
    const webhookUrl = joinURL(site.url, 'webhooks/telegram/wallet_hunting_bot')
    const bot = createBot()
    const isSet = await bot.api.setWebhook(webhookUrl, {
      secret_token: webhookToken,
    })
    const info = await bot.api.getWebhookInfo()

    if (!isSet) {
      return {
        result: `Failed to set Telegram webhook to ${webhookUrl}`,
      }
    }

    const maskToken = maskSecret(webhookToken)

    return {
      result: `
Telegram webhook successfully set to: ${maskToken(webhookUrl)}

Webhook info:
${maskToken(JSON.stringify(info, undefined, 2))}
`.trim(),
    }
  },
})

function maskSecret(secret: string) {
  return (value: string) => value.replaceAll(secret, '*'.repeat(secret.length))
}
