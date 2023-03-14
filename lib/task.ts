import dayjs from 'dayjs'
import _ from 'lodash'
import { store } from 'store'
import { Feed, FeedEntry } from 'types'
import { HOST } from './constants'
import { createEntries } from './db'
import { extract } from './parser'
import { post } from './request'

const DAYS_LIMIT = {
  Day: 1,
  Week: 7,
  Month: 30,
  Year: 365,
}

export async function fetchFeedFlow(feeds: Feed[]) {
  try {
    const publishLimit = store.getState().setting.flow.publishLimit || 'Month'
    const result = await Promise.all(
      feeds.map(async (feed) => {
        try {
          const result = await extract(feed.url)

          return {
            ...result,
            url: feed.url,
            entries: (result.entries || [])
              .map((entry: FeedEntry) => ({
                ...entry,
                sourceUrl: feed.url,
                id: entry.id || entry.link,
                tags: [],
              }))
              .filter((entry: FeedEntry) => {
                return (
                  dayjs().diff(dayjs(entry.published), 'day') >
                  DAYS_LIMIT[publishLimit]
                )
              }),
          }
        } catch (error) {
          return null
        }
      })
    )

    const entries = _.flatten(result.map((t) => t?.entries || []))

    createEntries(entries)
  } catch (error) {}
}

export async function tagFeedEntries(entries: FeedEntry[]) {
  try {
    const untaggedEntries = entries.filter((entry) => {
      return !entry.tags || entry.tags.length === 0
    })

    const result = await post(`${HOST}/keywords`, {
      entries: untaggedEntries.map((t) => t.id),
    })

    // await Promise.all(
    //   untagged.map(async (feed) => {
    //     try {

    //       store.dispatch({
    //         type: 'feed/tagFeedEntries',
    //         payload: {
    //           sourceUrl: feed.sourceUrl,
    //           entries: result,
    //         },
    //       })
    //     } catch (error) {}
    //   })
    // )
  } catch (error) {}
}
