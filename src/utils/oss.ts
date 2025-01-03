import { createReadStream } from 'node:fs'
import path from 'node:path'
import OSS from 'ali-oss'

const { oss } = useRuntimeConfig()

const store = new OSS({
  region: oss.region,
  accessKeyId: oss.accessKeyId,
  accessKeySecret: oss.accessKeySecret,
  bucket: oss.bucket,
})

/**
 * 上传文件到阿里云OSS
 * @param file 文件路径或Buffer
 * @param filePrefix 文件前缀目录
 * @returns 文件访问URL
 */
export async function uploadToAliOss(
  // eslint-disable-next-line node/prefer-global/buffer
  file: string | Buffer,
  filePrefix: string,
): Promise<string> {
  try {
    const fileName =
      typeof file === 'string' ? path.basename(file) : `${Date.now()}.png`

    const ossPath = `${filePrefix}/${fileName}`

    const fileStream = typeof file === 'string' ? createReadStream(file) : file

    const result = await store.put(ossPath, fileStream)

    if (!result.url) {
      throw new Error('Upload failed: No URL returned')
    }

    return result.url.replace(/^http:/, 'https:')
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}
