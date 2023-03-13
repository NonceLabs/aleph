import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import _ from 'lodash'
import { store } from 'store'
import { FeedEntry } from 'types'
import { HOST } from './constants'
import { extract } from './parser'
import { post } from './request'

const BACKGROUND_FETCH_TASK = 'background-fetch'

export async function fetchFeedFlow() {
  const sources = store.getState().feed.sources || []
  try {
    const result = await Promise.all(
      sources.map(async (source) => {
        try {
          const result = await extract(source.url)

          return {
            ...result,
            url: source.url,
            entries: (result.entries || []).map((entry: FeedEntry) => ({
              ...entry,
              sourceUrl: source.url,
              id: entry.id || entry.link,
            })),
          }
        } catch (error) {
          return null
        }
      })
    )

    store.dispatch({
      type: 'feed/updateFlow',
      payload: result.filter((t) => t),
    })
    store.dispatch({
      type: 'feed/updateSources',
      payload: sources.map((t) => {
        const feed = result.find((f) => f.url === t.url)
        if (feed) {
          return {
            ...t,
            favicon: feed.favicon,
            description: feed.description,
          }
        }
        return t
      }),
    })
  } catch (error) {
    //
  }
}

export async function tagFeedEntries() {
  const flow = store.getState().feed.flow || []
  try {
    const untagged = flow.map((feed) => {
      const entries = (feed.entries || [])
        ?.filter((entry) => {
          return !entry.tags || entry.tags.length === 0
        })
        .map((entry) => entry.id)
        .filter((t) => (t || '').startsWith('http'))
        .slice(0, 5)

      return {
        sourceUrl: feed.url,
        entries,
      }
    })
    await Promise.all(
      untagged.map(async (feed) => {
        try {
          const result = await post(`${HOST}/keywords`, {
            entries: feed.entries,
            sourceUrl: feed.sourceUrl,
          })
          store.dispatch({
            type: 'feed/tagFeedEntries',
            payload: {
              sourceUrl: feed.sourceUrl,
              entries: result,
            },
          })
        } catch (error) {}
      })
    )
  } catch (error) {}
}

// // 1. Define the task by providing a name and the function that should be executed
// // Note: This needs to be called in the global scope (e.g outside of your React components)
// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
//   const now = Date.now()

//   console.log(
//     `Got background fetch call at date: ${new Date(now).toISOString()}`
//   )
//   await fetchFeedFlow()
//   // Be sure to return the successful result type!
//   return BackgroundFetch.BackgroundFetchResult.NewData
// })

// // 2. Register the task at some point in your app by providing the same name,
// // and some configuration options for how the background fetch should behave
// // Note: This does NOT need to be in the global scope and CAN be used in your React components!
// export async function registerBackgroundFetchAsync() {
//   console.log('registerBackgroundFetchAsync')

//   return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
//     minimumInterval: 60 * 5, // 5 minutes
//     stopOnTerminate: false, // android only,
//     startOnBoot: true, // android only
//   })
// }

// export async function unregisterBackgroundFetchAsync() {
//   return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK)
// }
