import * as fsp from 'node:fs/promises'
import * as path from 'node:path'
import process from 'node:process'
import * as url from 'node:url'
import { consola } from 'consola'
import { ofetch } from 'ofetch'
import { getHttpProxyConfig } from '../utils'
import 'dotenv/config'

const fetchOptions = getHttpProxyConfig()
const rootDir = url.fileURLToPath(new URL('..', import.meta.url))
const envPath = path.join(rootDir, '.env')

await initEnvFile()
await prepareTelegramBotInfo()

async function prepareTelegramBotInfo() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    consola.error('Missing "TELEGRAM_BOT_TOKEN" environment variable')
    process.exit(1)
  }

  const response = await ofetch<Record<string, any>>(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`,
    fetchOptions,
  )

  if (process.env.TELEGRAM_BOT_INFO) {
    consola.success('Telegram bot info already prefetched')
  } else {
    await updateEnvFile({ TELEGRAM_BOT_INFO: JSON.stringify(response.result) })
    consola.success('Prefetched Telegram bot info')
  }
}

async function initEnvFile() {
  try {
    await fsp.access(envPath)
  } catch {
    await fsp.writeFile(envPath, '', 'utf-8')
    consola.info('Created .env file')
  }
}

async function updateEnvFile(updates: Record<string, string>) {
  let envContent = await fsp.readFile(envPath, 'utf-8')
  envContent = `${envContent.trimEnd()}\n`

  for (const [key, value] of Object.entries(updates)) {
    const assignmentRegExp = new RegExp(`^${key}=.*`, 'm')
    if (assignmentRegExp.test(envContent)) {
      envContent = envContent.replace(assignmentRegExp, `${key}=${value}`)
    } else {
      envContent += `${key}=${value}\n`
    }
  }

  await fsp.writeFile(envPath, envContent)
}
