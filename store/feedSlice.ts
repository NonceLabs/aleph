import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { Track } from 'react-native-track-player'
import { Feed } from 'types'

interface FeedSlice {
  explore: { title: string; items: Feed[] }[]
  playlist: Track[]
}

const initialState: FeedSlice = {
  explore: [],
  playlist: [],
}

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setExplore: (state, action) => {
      state.explore = action.payload
    },
    updatePlaylist: (state, action) => {
      state.playlist = action.payload
    },
    updatePosition: (state, action) => {
      const { id, position, duration } = action.payload
      state.playlist = state.playlist.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            position,
            duration,
            playing: true,
          }
        }
        return {
          ...t,
          playing: false,
        }
      })
    },
  },
})

export const {} = feedSlice.actions

export default feedSlice.reducer
