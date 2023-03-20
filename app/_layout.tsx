import * as Updates from 'expo-updates'
import 'react-native-url-polyfill/auto'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import { TamaguiProvider } from 'tamagui'
import config from '../lib/tamagui.config'
import { LogBox } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { store } from 'store'
import { Drawer } from './Drawer'
import DrawerPanel from 'components/DrawerPanel'
import useTheme from 'hooks/useTheme'
import ToastContainer from 'components/ToastContainer'
import { Host } from 'react-native-portalize'

LogBox.ignoreAllLogs()

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter: require('../assets/fonts/Inter.ttf'),
    Gilroy: require('../assets/fonts/Gilroy-Medium.ttf'),
    'Gilroy-Bold': require('../assets/fonts/Gilroy-Bold.ttf'),
    Vollkorn: require('../assets/fonts/Vollkorn.ttf'),
    Arvo: require('../assets/fonts/Arvo-Regular.ttf'),
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    ...FontAwesome.font,
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  )
}

function RootLayoutNav() {
  const theme = useTheme()

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <TamaguiProvider config={config} defaultTheme={theme}>
            <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
              <Host>
                <Drawer
                  initialRouteName="index"
                  drawerContent={DrawerPanel}
                  screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                      width: 250,
                    },
                  }}
                >
                  <Drawer.Screen
                    name="index"
                    options={{
                      headerShown: false,
                      header: () => null,
                    }}
                  />
                  <Drawer.Screen
                    name="settings"
                    options={{
                      headerShown: false,
                      header: () => null,
                    }}
                  />
                  <Drawer.Screen
                    name="feeds"
                    options={{
                      headerShown: false,
                      header: () => null,
                    }}
                  />
                  <Drawer.Screen
                    name="bookmarks"
                    options={{ headerShown: false, header: () => null }}
                  />
                  <Drawer.Screen
                    name="explore"
                    options={{ headerShown: false, header: () => null }}
                  />
                </Drawer>
                <ToastContainer />
              </Host>
            </ThemeProvider>
          </TamaguiProvider>
        </Provider>
      </GestureHandlerRootView>
    </>
  )
}
