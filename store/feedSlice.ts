import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { FeedEntry } from '../types'

interface FeedSlice {
  watchlist: FeedEntry[]
}

const initialState: FeedSlice = {
  watchlist: [],
}

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
})

export const {} = feedSlice.actions

export default feedSlice.reducer
