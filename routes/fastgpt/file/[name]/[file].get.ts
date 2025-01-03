export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  const file = getRouterParam(event, 'file')
  if (!name || !file) {
    return new Response('invalid parameter', { status: 400 })
  }
  const txt = (await useStorage('assets:upload').getItem(
    `${name}/${file}`,
  )) as string
  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
})
