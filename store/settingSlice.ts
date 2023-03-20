import { createSlice } from '@reduxjs/toolkit'
import { FeedPublishLimit } from '../types'

interface SettingSlice {
  reader: {
    fontSize: number
    fontFamily: string
    theme: 'light' | 'dark'
  }
  flow: {
    hideRead: boolean
    publishLimit: FeedPublishLimit
  }
}

const initialState: SettingSlice = {
  reader: {
    fontSize: 20,
    fontFamily: 'Vollkorn',
    theme: 'light',
  },
  flow: {
    hideRead: false,
    publishLimit: FeedPublishLimit.Ever,
  },
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    updateFontSize: (state, action) => {
      state.reader.fontSize = action.payload
    },
    updateFontFamily: (state, action) => {
      state.reader.fontFamily = action.payload
    },
    updateReaderTheme: (state, action) => {
      state.reader.theme = action.payload
    },
    updateHideRead: (state, action) => {
      state.flow.hideRead = action.payload
    },
    updatePublishLimit: (state, action) => {
      state.flow.publishLimit = action.payload
    },
  },
})

export const {} = settingSlice.actions

export default settingSlice.reducer
