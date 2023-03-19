import dayjs from 'dayjs'
import _ from 'lodash'
import { store } from 'store'
import { Feed, FeedData, FeedEntry } from 'types'
import { HOST } from './constants'
import { createEntries, updateEntries } from './db'
import { fetcher, post } from './request'

const DAYS_LIMIT = {
  Day: 1,
  Week: 7,
  Month: 30,
  Year: 365,
  Ever: -1,
}

export async function extract(url: string): Promise<FeedData> {
  return await fetcher(`${HOST}/extract?url=${encodeURIComponent(url)}`)
}

export async function fetchFeedFlow(feeds: Feed[]) {
  try {
    const publishLimit = store.getState().setting.flow.publishLimit || 'Month'
    await Promise.all(
      feeds.map(async (feed) => {
        try {
          const result = await extract(feed.url)
          const entries =
            result.entries ||
            [].filter((entry: FeedEntry) => {
              if (publishLimit === 'Ever') {
                return true
              }
              return (
                dayjs().diff(dayjs(entry.published), 'day') <=
                DAYS_LIMIT[publishLimit]
              )
            })
          createEntries(entries)
        } catch (error) {
          return null
        }
      })
    )
  } catch (error) {}
}

export async function tagFeedEntries(entries: FeedEntry[]) {
  try {
    const untaggedEntries = entries.filter((entry) => {
      return (
        entry.id.startsWith('http') && (!entry.tags || entry.tags.length === 0)
      )
    })

    if (untaggedEntries.length === 0) {
      return
    }
    const result = await post(`${HOST}/keywords`, {
      entries: untaggedEntries.slice(0, 10).map((t) => t.id),
    })

    const taggedEntries = untaggedEntries.map((entry, idx) => {
      return {
        ...entry,
        tags: result[idx] || [],
      }
    })

    updateEntries(taggedEntries)
  } catch (error) {}
}
