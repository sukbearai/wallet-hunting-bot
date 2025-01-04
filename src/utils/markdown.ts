import removeMd from 'remove-markdown'

export function cleanMarkdown(text: string): string {
  return removeMd(text, {
    replaceLinksWithURL: true,
    stripListLeaders: true,
    useImgAltText: false,
  })
}
