import process from 'node:process'
import { ofetch } from 'ofetch'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { ProxyAgent } from 'undici'

// 代理配置
const PROXY_CONFIG = {
  HTTP: 'http://127.0.0.1:7890',
  SOCKS: 'socks5://127.0.0.1:7890',
}

// 环境判断
export const isDev = process.env.NODE_ENV !== 'production'

// HTTP代理配置
export const getHttpProxyConfig = () => {
  return isDev ? { dispatcher: new ProxyAgent(PROXY_CONFIG.HTTP) } : {}
}

// SOCKS代理配置
export const getSocksProxyAgent = () => {
  return isDev ? new SocksProxyAgent(PROXY_CONFIG.SOCKS) : undefined
}

export const fetchWithProxy = ofetch.create(getHttpProxyConfig())
