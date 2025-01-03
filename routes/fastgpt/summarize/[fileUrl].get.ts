const { fastGpt } = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const fileUrl = decodeURIComponent(getRouterParam(event, 'fileUrl') || '')

  if (!fileUrl)
    return {
      status: 400,
      body: 'fileUrl is required',
    }

  const body = {
    // chatId: 'abcd',
    stream: false,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '总结和分析txt文件内的推文数据',
          },
          {
            type: 'file_url',
            name: fileUrl.split('/').pop(),
            url: fileUrl,
          },
        ],
      },
    ],
  }
  return await $fetch(`${fastGpt.apiUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${fastGpt.apiKey}`,
      ContentType: 'application/json',
    },
    body,
  })
})
