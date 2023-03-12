import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import config from '../lib/tamagui.config'
import { LogBox } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { store } from 'store'
import { Drawer } from './Drawer'
import DrawerPanel from 'components/DrawerPanel'
import AddFeedButton from 'components/AddFeedButton'

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
    'Gilroy-Bold': require('../assets/fonts/Gilroy-Bold.ttf'),
    Vollkorn: require('../assets/fonts/Vollkorn.ttf'),
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
  const colorScheme = useColorScheme()

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <TamaguiProvider config={config}>
            <ThemeProvider
              value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
              <Drawer
                initialRouteName="flow"
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
                  }}
                />
                <Drawer.Screen
                  name="feeds"
                  options={{
                    drawerLabel: 'Feeds',
                    title: 'Feeds',
                    headerRight: AddFeedButton,
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
              </Drawer>
            </ThemeProvider>
          </TamaguiProvider>
        </Provider>
      </GestureHandlerRootView>
    </>
  )
}
