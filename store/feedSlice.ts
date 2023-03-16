import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { FeedEntry } from '../types'

interface FeedSlice {
  playing: FeedEntry | undefined
  playlist: FeedEntry[]
}

const initialState: FeedSlice = {
  playing: undefined,
  playlist: [],
}

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
})

export const {} = feedSlice.actions

export default feedSlice.reducer
