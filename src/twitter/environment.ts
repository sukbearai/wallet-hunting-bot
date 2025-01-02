import { z } from 'zod'
import { parseBooleanFromText } from './parsing'
export const DEFAULT_MAX_TWEET_LENGTH = 280

const twitterUsernameSchema = z
  .string()
  .min(1)
  .max(15)
  .regex(/^[A-Z]\w*[A-Z0-9]$|^[A-Z]$/i, 'Invalid Twitter username format')

export const twitterEnvSchema = z.object({
  TWITTER_PROXY_URL: z.string(),
  TWITTER_DRY_RUN: z.boolean(),
  TWITTER_USERNAME: z.string().min(1, 'Twitter username is required'),
  TWITTER_PASSWORD: z.string().min(1, 'Twitter password is required'),
  TWITTER_EMAIL: z.string().email('Valid Twitter email is required'),
  MAX_TWEET_LENGTH: z.number().int().default(DEFAULT_MAX_TWEET_LENGTH),
  TWITTER_SEARCH_ENABLE: z.boolean().default(false),
  TWITTER_2FA_SECRET: z.string(),
  TWITTER_RETRY_LIMIT: z.number().int(),
  TWITTER_POLL_INTERVAL: z.number().int(),
  TWITTER_TARGET_USERS: z.array(twitterUsernameSchema).default([]),
  // I guess it's possible to do the transformation with zod
  // not sure it's preferable, maybe a readability issue
  // since more people will know js/ts than zod
  /*
        z
        .string()
        .transform((val) => val.trim())
        .pipe(
            z.string()
                .transform((val) =>
                    val ? val.split(',').map((u) => u.trim()).filter(Boolean) : []
                )
                .pipe(
                    z.array(
                        z.string()
                            .min(1)
                            .max(15)
                            .regex(
                                /^[A-Za-z][A-Za-z0-9_]*[A-Za-z0-9]$|^[A-Za-z]$/,
                                'Invalid Twitter username format'
                            )
                    )
                )
                .transform((users) => users.join(','))
        )
        .optional()
        .default(''),
    */
  POST_INTERVAL_MIN: z.number().int(),
  POST_INTERVAL_MAX: z.number().int(),
  ENABLE_ACTION_PROCESSING: z.boolean(),
  ACTION_INTERVAL: z.number().int(),
  POST_IMMEDIATELY: z.boolean(),
})

export type TwitterConfig = z.infer<typeof twitterEnvSchema>

function parseTargetUsers(targetUsersStr?: string | null): string[] {
  if (!targetUsersStr?.trim()) {
    return []
  }

  return targetUsersStr
    .split(',')
    .map((user) => user.trim())
    .filter(Boolean) // Remove empty usernames
  /*
      .filter(user => {
          // Twitter username validation (basic example)
          return user && /^[A-Za-z0-9_]{1,15}$/.test(user);
      });
      */
}

function safeParseInt(
  value: string | undefined | null,
  defaultValue: number,
): number {
  if (!value) return defaultValue
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? defaultValue : Math.max(1, parsed)
}

const { twitter } = useRuntimeConfig()

export async function validateTwitterConfig(): Promise<TwitterConfig> {
  try {
    const twitterConfig = {
      TWITTER_PROXY_URL: twitter.proxyUrl || '',
      TWITTER_DRY_RUN: parseBooleanFromText(twitter.dryRun) ?? false, // parseBooleanFromText return null if "", map "" to false
      TWITTER_USERNAME: twitter.username,
      TWITTER_PASSWORD: twitter.password,
      TWITTER_EMAIL: twitter.email,
      // number as string?
      MAX_TWEET_LENGTH: safeParseInt(
        twitter.maxTweetLength,
        DEFAULT_MAX_TWEET_LENGTH,
      ),
      // bool
      TWITTER_SEARCH_ENABLE:
        parseBooleanFromText(twitter.searchEnable) ?? false,
      // string passthru
      TWITTER_2FA_SECRET: twitter.twoFactorSecret || '',
      // int
      TWITTER_RETRY_LIMIT: safeParseInt(twitter.retryLimit, 5),
      // int in seconds
      TWITTER_POLL_INTERVAL: safeParseInt(twitter.pollInterval, 120), // 2m
      // comma separated string
      TWITTER_TARGET_USERS: parseTargetUsers(twitter.targetUsers),
      // int in minutes
      POST_INTERVAL_MIN: safeParseInt(twitter.postIntervalMin, 90), // 1.5 hours
      // int in minutes
      POST_INTERVAL_MAX: safeParseInt(twitter.postIntervalMax, 180), // 3 hours
      // bool
      ENABLE_ACTION_PROCESSING:
        parseBooleanFromText(twitter.enableActionProcessing) ?? false,
      // int in minutes (min 1m)
      ACTION_INTERVAL: safeParseInt(twitter.actionInterval, 5), // 5 minutes
      // bool
      POST_IMMEDIATELY: parseBooleanFromText(twitter.postImmediately) ?? false,
    }

    return twitterEnvSchema.parse(twitterConfig)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n')
      throw new Error(
        `Twitter configuration validation failed:\n${errorMessages}`,
      )
    }
    throw error
  }
}
