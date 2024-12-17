import { bot } from '../src'

export default eventHandler(async (evt) => {
  const { telegram } = useRuntimeConfig()
  const host = getRequestHeader(evt, 'x-forwarded-host') || getRequestHost(evt)
  const webhookUrl = `https://${host}/telegram-hook?token=${telegram.authToken}`
  const isSet = await bot.telegram.setWebhook(webhookUrl)
  const info = await bot.telegram.getWebhookInfo()
  return `Set webhook to ${webhookUrl.replaceAll(
    telegram.authToken,
    '*',
  )}: ${isSet}<br/>${JSON.stringify(info).replaceAll(telegram.authToken, '*')}`
})
