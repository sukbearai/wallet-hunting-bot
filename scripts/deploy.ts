import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const versionPath = resolve(process.cwd(), 'src/utils/version.ts')
const packageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'),
)
const versionFile = readFileSync(versionPath, 'utf-8')

const newContent = versionFile.replace(
  /version = ['"].*?['"]/,
  `version = '${packageJson.version}'`,
)

writeFileSync(versionPath, newContent)
