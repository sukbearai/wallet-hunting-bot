export default defineEventHandler((event) => {
  return sendRedirect(event, 'https://t.me/wallet_hunting_bot', 302)
})
