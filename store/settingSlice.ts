import { createSlice } from '@reduxjs/toolkit'

interface SettingSlice {
  reader: {
    fontSize: number
    fontFamily: string
    theme: 'light' | 'dark'
  }
  flow: {
    hideRead: boolean
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
      if (!state.flow) {
        state.flow = { hideRead: false }
      }
      state.flow.hideRead = action.payload
    },
  },
})

export const {} = settingSlice.actions

export default settingSlice.reducer
