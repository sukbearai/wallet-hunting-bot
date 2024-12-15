import process from 'node:process'
import { consola } from 'consola'
import * as v from 'valibot'

const envSchema = v.object({
  TELEGRAM_BOT_TOKEN: v.pipe(v.string(), v.nonEmpty()),
  TELEGRAM_BOT_INFO: v.pipe(v.string(), v.nonEmpty()),
  WEBHOOK_SECRET: v.pipe(v.string(), v.nonEmpty()),
})

// Skip on Nitro prepare setup
const shouldValidate = process.env.NITRO_PREPARE !== 'true'
const result = v.safeParse(envSchema, process.env)

if (shouldValidate && !result.success) {
  consola.error(
    `Missing environment variables:\n${result.issues
      .filter((issue) => issue.path != null)
      .map((issue) => `  - ${issue.path![0].key}: ${issue.message}`)
      .join('\n')}`,
  )
  throw new Error('Failed to validate environment variables')
}

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends v.InferInput<typeof envSchema> {}
  }
}
