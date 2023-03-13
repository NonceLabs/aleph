import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { FeedEntry, Source, FeedData } from '../types'

interface FeedSlice {
  sources: Source[]
  watchlist: FeedEntry[]
  bookmarked: FeedEntry[]
  flow: FeedData[]
}

const initialState: FeedSlice = {
  sources: [
    {
      title: 'The Verge',
      url: 'https://www.theverge.com/rss/full.xml',
      description:
        'The Verge covers the intersection of technology, science, art, and culture.',
      link: 'https://www.theverge.com/',
      favicon: 'https://cdn.vox-cdn.com/verge/favicon.ico',
    },
    {
      title: 'Michael Tsai',
      url: 'https://mjtsai.com/blog/feed/',
      description: '',
      link: 'https://mjtsai.com/blog',
      favicon: 'https://mjtsai.com/favicon.ico',
    },
  ],
  watchlist: [],
  bookmarked: [],
  flow: [],
}

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    subscribe: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.sources = [...state.sources, ...action.payload]
      } else {
        state.sources.push(action.payload)
      }
    },
    unsubscribe: (state, action) => {
      state.sources = state.sources.filter((t) => t.url !== action.payload.url)
      state.flow = state.flow.filter((t) => t.url !== action.payload.url)
    },
    updateSources: (state, action) => {
      state.sources = action.payload
    },
    markAllAsRead: (state, action) => {
      state.flow = state.flow.map((t) => {
        return {
          ...t,
          entries: t.entries?.map((t) => ({ ...t, read: true })),
        }
      })
    },
    tagFeedEntries: (state, action) => {
      const { sourceUrl, entries } = action.payload
      const old = state.flow.find((t) => t.url === sourceUrl)
      if (old) {
        old.entries = (old.entries || [])?.map((t) => {
          const newEntry = entries.find((e: any) => e.url === t.id)
          if (newEntry) {
            return {
              ...t,
              tags: newEntry.keywords,
            }
          }
          return t
        })
      }
    },
    updateFlow: (state, action) => {
      if (!Array.isArray(state.flow)) {
        state.flow = []
      }

      if (Array.isArray(action.payload)) {
        action.payload.forEach((item: FeedData) => {
          const oldIndex = state.flow.findIndex((t) => t.url === item.url)
          if (oldIndex !== -1) {
            const old = state.flow[oldIndex]
            state.flow.splice(oldIndex, 1, {
              ...item,
              entries: _.uniqBy(
                [...(old.entries || []), ...(item.entries || [])],
                'id'
              ),
            })
          } else {
            state.flow.push(item)
          }
        })
      }
    },
    bookmark: (state, action) => {
      if (!state.bookmarked) {
        state.bookmarked = [action.payload]
      } else if (state.bookmarked.some((t) => t.id === action.payload.id)) {
        state.bookmarked = state.bookmarked.filter(
          (t) => t.id !== action.payload.id
        )
      } else {
        state.bookmarked.push(action.payload)
      }
    },
    read: (state, action) => {
      const { url, id } = action.payload
      const feed = state.flow.find((t) => t.url === url)
      if (feed) {
        const entry = feed.entries?.find((t) => t.id === id)
        if (entry) {
          entry.read = true
        }
      }
    },
  },
})

export const {} = feedSlice.actions

export default feedSlice.reducer
