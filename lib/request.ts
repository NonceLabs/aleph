import { Platform } from 'react-native'
import Constants from 'expo-constants'

export const getBuildVersion = () => {
  return Constants.expoConfig?.version || 'Unknown'
}

export const post = async (url: string, json: object) => {
  const body = JSON.stringify(json)
  try {
    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'app-version': getBuildVersion(),
        platform: Platform.OS,
      },
    })
    const responseJson = await response.json()
    console.log('✅POST - ', url, json)
    return responseJson
  } catch (error) {
    console.log('❌POST - ', url, json)
    throw error
  }
}

export const fetcher = async (url: string, headers = {}) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), 60000)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        ...headers,
        'app-version': getBuildVersion(),
        platform: Platform.OS,
      },
    })
    clearTimeout(id)
    console.log('✅GET - ', url)

    return response.json()
  } catch (error) {
    console.log('❌GET - ', url)
    throw error
  }
}
