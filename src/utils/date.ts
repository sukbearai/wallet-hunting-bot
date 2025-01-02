import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDate(isoString: string) {
  const date = new Date(isoString)

  return {
    formatted: format(date, 'yyyy年MM月dd日 HH:mm:ss', {
      locale: zhCN,
    }),

    relative: formatDistanceToNow(date, {
      locale: zhCN,
      addSuffix: true,
    }),
  }
}
