// Custom error handler for production environment
// See: https://github.com/unjs/nitro/blob/a399e189576d4c18d7f837bd454e0503e1f53980/src/runtime/internal/error.ts
import type { NitroErrorHandler } from 'nitropack'
import { normalizeError } from 'nitropack/runtime/utils'

interface ParsedError {
  url: string
  statusCode: number
  statusMessage: number
  message: string
  stack?: string[]
}

export default defineNitroErrorHandler(((error, event) => {
  const { stack, statusCode, statusMessage, message } = normalizeError(error)

  const showDetails = import.meta.dev && statusCode !== 404
  const errorObject: ParsedError = {
    url: event.path,
    statusCode,
    statusMessage,
    message,
    stack: showDetails ? stack.map((i) => i.text) : undefined,
  }

  // Console output
  if (error.unhandled || error.fatal) {
    const tags = [
      '[nitro]',
      '[request error]',
      error.unhandled && '[unhandled]',
      error.fatal && '[fatal]',
    ]
      .filter(Boolean)
      .join(' ')

    console.error(
      tags,
      `${error.message}\n${stack.map((l) => `  ${l.text}`).join('  \n')}`,
    )
  }

  setResponseStatus(event, statusCode, statusMessage)
  setResponseHeader(event, 'Content-Type', 'application/json')

  return send(event, JSON.stringify(errorObject))
}) satisfies NitroErrorHandler)
