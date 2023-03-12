import { FeedEntry } from 'types'

export function tag(items: FeedEntry[]) {}

export function extractImages(content?: string) {
  if (!content) {
    return []
  }
  let m
  const urls = []
  const rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g

  while ((m = rex.exec(content))) {
    urls.push(m[1])
  }
  return urls
}
