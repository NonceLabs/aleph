import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { FeedEntry } from '../types'

interface FeedSlice {
  playing: FeedEntry | undefined
  isPlaying: boolean
  playlist: FeedEntry[]
}

const initialState: FeedSlice = {
  playing: undefined,
  isPlaying: false,
  playlist: [],
}

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    play: (state, action) => {
      if (!state.isPlaying) {
        state.isPlaying = true
      } else {
        state.isPlaying = state.playing?.id !== action.payload.id
      }
      state.playing = action.payload
      state.playlist = _.uniqBy(
        [action.payload, ...(state.playlist || [])],
        'id'
      )
    },
    addToList: (state, action) => {
      state.playlist = _.uniqBy(
        [...(state.playlist || []), action.payload],
        'id'
      )
      if (!state.isPlaying) {
        state.isPlaying = true
        state.playing = action.payload
      }
    },
  },
})

export const {} = feedSlice.actions

export default feedSlice.reducer
