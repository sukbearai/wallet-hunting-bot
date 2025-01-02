/* eslint-disable node/prefer-global/process */
import * as fs from 'node:fs'
import path from 'node:path'
import { consola } from './log'

export function generateCookiesFile(cookie: any[]): boolean {
  try {
    const rootDir = process.cwd()
    const cookiesPath = path.join(rootDir, 'cookies.json')

    // 写入文件
    fs.writeFileSync(cookiesPath, JSON.stringify(cookie, null, 2), 'utf-8')

    consola.info('✅ Cookies 已保存到:', cookiesPath)
    return true
  } catch (error) {
    consola.error('❌ 生成 cookies.json 失败:', error)
    return false
  }
}
