import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { FeedEntry, PlayingFeedEntry } from '../types'

interface FeedSlice {
  playing: PlayingFeedEntry | undefined
  isPlaying: boolean
  playlist: PlayingFeedEntry[]
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
      if (state.playing) {
        state.playlist = _.uniqBy(
          [action.payload, state.playing, ...(state.playlist || [])],
          'id'
        )
      } else {
        state.playlist = _.uniqBy(
          [action.payload, ...(state.playlist || [])],
          'id'
        )
      }
    },
    playNext: (state, action) => {
      state.isPlaying = true
      if (state.playlist.length > 1) {
        state.playing = state.playlist[1]
        state.playlist = state.playlist.slice(1)
      }
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
    updatePlayingPosition: (state, action) => {
      if (state.playing) {
        state.playing.position = action.payload
      }
    },
  },
})

export const {} = feedSlice.actions

export default feedSlice.reducer
