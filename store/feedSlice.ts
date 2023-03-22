import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { State, Track } from 'react-native-track-player'
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
      state.playlist = action.payload.map((t: Track) => {
        const oldOne = state.playlist.find((p) => p.id === t.id)
        return oldOne || t
      })
    },
    updatePosition: (state, action) => {
      const { id, position, duration, playing } = action.payload
      state.playlist = state.playlist.map((t) => {
        if (t.id === id) {
          if ([State.Buffering, State.Loading].includes(playing)) {
            return {
              ...t,
              playing,
            }
          }
          return {
            ...t,
            position,
            duration,
            playing,
          }
        }
        return {
          ...t,
          playing: State.Paused,
        }
      })
    },
  },
})

export const {} = feedSlice.actions

export default feedSlice.reducer
