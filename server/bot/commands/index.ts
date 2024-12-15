import type { FFContext } from '../types'
import { Composer } from 'grammy'
import advent from './advent'
import advent_teilen from './advent_teilen'
import help from './help'
import id from './id'
import search from './search'
import start from './start'

const commands = new Composer<FFContext>()

commands.use(advent, advent_teilen, help, id, search, start)

export { commands }
