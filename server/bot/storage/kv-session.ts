import type { StorageAdapter } from 'grammy/web'
import type { Storage, StorageValue } from 'unstorage'

export class KVStorageAdapter<T extends StorageValue>
  implements StorageAdapter<T>
{
  private storage: Storage<StorageValue>

  constructor(
    /** @default 'kv' */
    base = 'kv',
  ) {
    this.storage = useStorage(base)
  }

  async read(key: string): Promise<T | undefined> {
    if (!(await this.storage.hasItem(key))) return undefined
    await this.storage.getItem<T>(key)
  }

  async write(key: string, data: T) {
    await this.storage.setItem(key, data)
  }

  async delete(key: string) {
    await this.storage.removeItem(key)
  }

  async has(key: string) {
    return await this.storage.hasItem(key)
  }
}
