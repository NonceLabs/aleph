import 'react-native-url-polyfill/auto'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen } from 'expo-router'
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

LogBox.ignoreAllLogs()

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'flow',
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter: require('../assets/fonts/Inter.ttf'),
    Gilroy: require('../assets/fonts/Gilroy-Medium.ttf'),
    'Gilroy-Bold': require('../assets/fonts/Gilroy-Bold.ttf'),
    Vollkorn: require('../assets/fonts/Vollkorn.ttf'),
    Arvo: require('../assets/fonts/Arvo-Regular.ttf'),
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
              <Drawer
                initialRouteName="feeds"
                drawerContent={DrawerPanel}
                screenOptions={{
                  drawerStyle: {
                    width: 250,
                  },
                }}
              >
                <Drawer.Screen
                  name="index"
                  options={{
                    drawerLabel: 'Flow',
                    header: () => null,
                  }}
                />
                <Drawer.Screen
                  name="settings"
                  options={{
                    drawerLabel: 'Settings',
                    title: 'Settings',
                    header: () => null,
                  }}
                />
                <Drawer.Screen
                  name="feeds"
                  options={{
                    drawerLabel: 'Feeds',
                    title: 'Feeds',
                    header: () => null,
                  }}
                />
                <Drawer.Screen
                  name="feed"
                  options={{ headerShown: false, header: () => null }}
                />
                <Drawer.Screen
                  name="bookmarks"
                  options={{ headerShown: false, header: () => null }}
                />
                <Drawer.Screen
                  name="reader"
                  options={{ headerShown: false, header: () => null }}
                />
                <Drawer.Screen
                  name="explore"
                  options={{ headerShown: false, header: () => null }}
                />
                <Drawer.Screen
                  name="tags"
                  options={{ headerShown: false, header: () => null }}
                />
              </Drawer>
            </ThemeProvider>
          </TamaguiProvider>
        </Provider>
      </GestureHandlerRootView>
    </>
  )
}
