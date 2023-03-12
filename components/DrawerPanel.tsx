import { Image } from 'expo-image'
import { Link } from 'expo-router'
import useTheme from 'hooks/useTheme'
import {
  BookmarkEmpty,
  Home,
  Planet,
  RssFeedTag,
  Settings,
} from 'iconoir-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, XStack, YStack } from 'tamagui'

const routes = [
  {
    href: '/',
    title: 'Home',
    Icon: Home,
  },
  {
    href: '/feeds',
    title: 'Feeds',
    Icon: RssFeedTag,
  },
  // {
  //   href: '/explore',
  //   title: 'Explore',
  //   Icon: Planet,
  // },
  {
    href: '/bookmarks',
    title: 'Bookmarks',
    Icon: BookmarkEmpty,
  },
  {
    href: '/settings',
    title: 'Settings',
    Icon: Settings,
  },
]

export default function DrawerPanel() {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const fontSize = 32
  return (
    <YStack
      flex={1}
      pt={insets.top}
      space
      px={8}
      jc="space-between"
      pb={insets.bottom + 80}
      bc={theme === 'light' ? '#f6eee3' : '$background'}
    >
      <XStack jc="flex-end">
        <YStack p={10} ai="flex-end" space={4}>
          <Image
            source={require('../assets/images/icon.png')}
            style={{ width: 80, height: 80 }}
          />
          <Text fontFamily={'Gilroy'} color="#f0353c">
            Aleph Reader
          </Text>
          <Text color="$gray10Light" fontSize={14}>
            Last update
          </Text>
        </YStack>
      </XStack>
      <YStack width="100%" space={8} ai="flex-end" pr={8}>
        {routes.map(({ href, title, Icon }) => {
          return (
            <Link key={title} href={href}>
              <XStack space={8} ai="center" jc="flex-end">
                <Text
                  textAlign="right"
                  fontWeight="bold"
                  fontSize={fontSize}
                  fontFamily="Gilroy-Bold"
                  width={200}
                  color="#f0353c"
                >
                  {title}
                </Text>
                <Icon width={30} height={30} color="#f0353c" />
              </XStack>
            </Link>
          )
        })}
      </YStack>
    </YStack>
  )
}
