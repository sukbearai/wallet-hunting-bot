export default defineEventHandler(async () => {
  return await $fetch(
    'https://api.crossspace.io/api/v2/kaboom-service/public/tokens/search?chain_id=101&search_text=scihub&page_offset=0&page_size=5',
    {
      method: 'POST',
    },
  )
})
