import type { FFContext } from '../types'
import { Composer } from 'grammy'
import { ofetch } from 'ofetch'
import { joinURL } from 'ufo'

const composer = new Composer<FFContext>()

const SEARCH_CATEGORIES = {
  all: {
    icon: '🔍',
    localizedSlug: 'allgemein',
  },
  other: {
    icon: '📦',
    localizedSlug: 'sonstiges',
  },
  calculator: {
    icon: '🧮',
    localizedSlug: 'rechner',
  },
  comparison: {
    icon: '📊',
    localizedSlug: 'vergleich',
  },
  informer: {
    icon: '📰',
    localizedSlug: 'informer',
  },
}

const SEARCH_CATEGORY_SLUGS = Object.keys(SEARCH_CATEGORIES)
const LOCALIZED_CATEGORY_KEYS = Object.values(SEARCH_CATEGORIES).map(
  (i) => i.localizedSlug,
)

composer.command(['seach', 'suche'], async (ctx) => {
  const $ff = ofetch.create({
    baseURL: 'https://api.finanzfluss.de',
  })

  if (!ctx.match) {
    await ctx.reply(
      `
Bitte gib einen Suchbegriff an.
Beispiel: <code>/suche Geldanlage</code>
Oder mit Kategorie: <code>/suche rechner:Rendite</code>

Unterstützte Kategorien: ${Object.values(SEARCH_CATEGORIES)
        .map(
          (category) =>
            `${category.icon} <code>${category.localizedSlug}</code>`,
        )
        .join(', ')}
`.trim(),
      { parse_mode: 'HTML' },
    )
    return
  }

  let category = 'all'
  let query = ctx.match

  let [possibleCategory, ...rest] = ctx.match.split(':')
  possibleCategory = possibleCategory.toLowerCase()
  if (
    [...SEARCH_CATEGORY_SLUGS, ...LOCALIZED_CATEGORY_KEYS].includes(
      possibleCategory,
    )
  ) {
    category = LOCALIZED_CATEGORY_KEYS.includes(possibleCategory)
      ? Object.entries(SEARCH_CATEGORIES).find(
          ([, { localizedSlug }]) => localizedSlug === possibleCategory,
        )![0]
      : possibleCategory
    query = rest.join(':')
  }

  try {
    const response = await $ff<Record<string, any>>('search', {
      query: {
        text: query,
        category,
        limit: 5,
      },
    })

    const results: Record<string, any>[] = response.results

    if (!results.length) {
      await ctx.reply('Keine Ergebnisse gefunden.')
      return
    }

    const message = results
      .map((item, index) =>
        `
<code>${pad(index + 1)}</code> ${item.title}: <a href="${joinURL('https://finanzfluss.de', item.uri)}">${item.uri}</a>
<em>${replaceTag(item.snippet, 'mark', 'u')}</em>
`.trim(),
      )
      .join('\n\n')

    await ctx.reply(message, {
      parse_mode: 'HTML',
    })
  } catch (error) {
    console.error(error)
    await ctx.reply('Es ist ein Fehler aufgetreten.')
  }
})

export default composer

function pad(value: number) {
  return (value < 10 ? '0' : '') + value
}

function replaceTag(html: string, oldTag: string, newTag: string) {
  const openingTagPattern = new RegExp(`<${oldTag}(\\s+[^>]*)?>`, 'gi')
  const closingTagPattern = new RegExp(`</${oldTag}>`, 'gi')

  const updatedHtml = html
    .replace(
      openingTagPattern,
      (match, attributes) => `<${newTag}${attributes || ''}>`,
    )
    .replace(closingTagPattern, `</${newTag}>`)

  return updatedHtml
}
