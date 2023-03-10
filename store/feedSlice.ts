import { createSlice } from '@reduxjs/toolkit'
import { Source } from '../types'

interface FeedSlice {
  sources: Source[]
}

const initialState: FeedSlice = {
  sources: [],
}

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
})

export const {} = feedSlice.actions

export default feedSlice.reducer
