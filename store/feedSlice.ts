import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { Feed } from 'types'

interface FeedSlice {
  explore: { title: string; items: Feed[] }[]
}

const initialState: FeedSlice = {
  explore: [],
}

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setExplore: (state, action) => {
      state.explore = action.payload
    },
  },
})

export const {} = feedSlice.actions

export default feedSlice.reducer
