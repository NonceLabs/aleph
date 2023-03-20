import { FeedEntry } from 'types'

export function tag(items: FeedEntry[]) {}

export function formatStatusTime(millis: number | undefined) {
  if (!millis) {
    return '00:00'
  }
  const minutes = Math.floor(millis / 60)
  const hours = Math.floor(minutes / 60)

  let s: number | string = Math.floor(millis % 60)
  s = s < 10 ? '0' + s : s

  let m: number | string = minutes % 60
  m = m < 10 ? '0' + m : m
  if (hours > 0) {
    return `${hours}:${m}:${s}`
  } else {
    return `${m}:${s}`
  }
}
