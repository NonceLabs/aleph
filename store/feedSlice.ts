import { createSlice } from '@reduxjs/toolkit'
import { FeedEntry, Source, FeedData } from '../types'

interface FeedSlice {
  sources: Source[]
  watchlist: FeedEntry[]
  bookmarked: FeedEntry[]
  flow: FeedData[]
  read: string[]
}

const initialState: FeedSlice = {
  sources: [
    {
      title: 'The Verge',
      url: 'https://www.theverge.com/rss/full.xml',
      description:
        'The Verge covers the intersection of technology, science, art, and culture.',
      link: 'https://www.theverge.com/',
      logo: 'https://cdn.vox-cdn.com/verge/favicon.ico',
    },
    {
      title: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      description: 'Startup and Technology News',
      link: 'https://techcrunch.com/',
      logo: 'https://techcrunch.com/favicon.ico',
    },
    {
      title: '纽约时报中文网',
      url: 'https://cn.nytimes.com/rss/',
      description: '纽约时报中文网 国际纵览',
      link: 'https://cn.nytimes.com',
      logo: 'https://cn.nytimes.com/favicon.ico',
    },
    {
      title: '一天世界',
      url: 'https://blog.yitianshijie.net/feed/',
      description: '一天世界，昆亂不擋。Lawrence Li 主理。IPN 出品。',
      link: 'https://blog.yitianshijie.net',
      logo: 'https://blog.yitianshijie.net/favicon.ico',
    },
  ],
  watchlist: [],
  bookmarked: [],
  flow: [],
  read: [],
}

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    addSource: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.sources = [...state.sources, ...action.payload]
      } else {
        state.sources.push(action.payload)
      }
    },
    updateFlow: (state, action) => {
      if (!Array.isArray(state.flow)) {
        state.flow = []
      }

      if (Array.isArray(action.payload)) {
        action.payload.forEach((item: FeedData) => {
          const oldIndex = state.flow.findIndex((t) => t.link === item.link)
          if (oldIndex !== -1) {
            state.flow.splice(oldIndex, 1, item)
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
  },
})

export const { addSource } = feedSlice.actions

export default feedSlice.reducer
