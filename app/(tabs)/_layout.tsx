import { Link, Tabs } from 'expo-router'
import { Pressable, useColorScheme } from 'react-native'
import { HomeAltSlim, Planet } from 'iconoir-react-native'
import { Plus } from '@tamagui/lucide-icons'
import { Button } from 'tamagui'
import Colors from '../../constants/Colors'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      initialRouteName="feeds"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name="feeds"
        options={{
          title: 'Feeds',
          tabBarIcon: ({ color }) => (
            <HomeAltSlim
              width={32}
              height={32}
              color={Colors[colorScheme ?? 'light'].text}
            />
          ),
          header: () => null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Planet
              width={32}
              height={32}
              color={Colors[colorScheme ?? 'light'].text}
            />
          ),
          header: () => null,
        }}
      />
    </Tabs>
  )
}
