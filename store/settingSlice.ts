import { createSlice } from '@reduxjs/toolkit'

interface SettingSlice {
  reader: {
    fontSize: number
    fontFamily: string
    theme: 'light' | 'dark'
  }
}

const initialState: SettingSlice = {
  reader: {
    fontSize: 20,
    fontFamily: 'Vollkorn',
    theme: 'light',
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
  },
})

export const {} = settingSlice.actions

export default settingSlice.reducer
