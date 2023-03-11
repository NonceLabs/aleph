import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import { store } from 'store'
import { FeedData, FeedEntry } from 'types'
import { extract } from './parser'

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
            link: source.link,
            url: source.url,
            entries: (result.entries || []).map((entry: FeedEntry) => ({
              ...entry,
              sourceUrl: source.url,
              id: entry.id || entry.link,
            })),
          }
        } catch (error) {
          console.log('error', error)

          return null
        }
      })
    )
    console.log('fetchingFeedFlow')

    store.dispatch({
      type: 'feed/updateFlow',
      payload: result.filter((t) => t),
    })
  } catch (error) {
    //
  }
}

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now()

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  )
  await fetchFeedFlow()
  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData
})

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 5, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  })
}

export async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK)
}
