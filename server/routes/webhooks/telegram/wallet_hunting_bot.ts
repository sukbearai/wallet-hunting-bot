import { createBot } from '~/bot'

export default defineEventHandler(async (event) => {
  const { webhookToken } = useRuntimeConfig(event)
  const token = getRequestHeader(event, 'X-Telegram-Bot-Api-Secret-Token')

  if (token !== webhookToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid X-Telegram-Bot-Api-Secret-Token header',
    })
  }

  const bot = createBot()
  const body = await readBody(event)
  await bot.handleUpdate(body)

  return 'OK'
})
