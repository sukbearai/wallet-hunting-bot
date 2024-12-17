export default defineEventHandler((event) => {
  const { telegram } = useRuntimeConfig()
  const query = getQuery(event)
  if (
    event.path.includes('/set-webhook') &&
    query.token !== telegram.authToken
  ) {
    throw createError({
      status: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid token',
    })
  }
})
