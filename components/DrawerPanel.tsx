import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import useFeeds from 'hooks/useFeeds'
import usePlaylist from 'hooks/usePlaylist'
import useTheme from 'hooks/useTheme'
import {
  BookmarkEmpty,
  Home,
  Label,
  Pause,
  Planet,
  Play,
  RssFeedTag,
  Settings,
} from 'iconoir-react-native'
import { MAIN_COLOR } from 'lib/constants'
import { useEffect, useRef } from 'react'
import { Animated, Easing, ImageBackground } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, XStack, YStack } from 'tamagui'
import Favicon from './Favicon'
import PlayingEntry from './PlayingEntry'

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
  {
    href: '/tags',
    title: 'Tags',
    Icon: Label,
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
  // {
  //   href: '/settings',
  //   title: 'Settings',
  //   Icon: Settings,
  // },
]

const AnimetedImage = Animated.createAnimatedComponent(ImageBackground)

export default function DrawerPanel() {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const fontSize = 32

  const { playing, isPlaying } = usePlaylist()
  const { feeds } = useFeeds()
  const feed = feeds.find((t) => t.url === playing?.feedUrl)

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
          <Text fontFamily={'Poppins'} color="#f0353c">
            Aleph Reader
          </Text>
        </YStack>
      </XStack>
      {playing && (
        <YStack ai="flex-end" jc="flex-end" space={8}>
          <XStack>
            <PlayingEntry playing={playing} isPlaying={isPlaying} size={100} />
          </XStack>
          {feed && (
            <XStack ai="center" jc="flex-end" space={8}>
              <Favicon favicon={feed?.favicon} />
              <Text
                color="$color12"
                fontFamily="Gilroy-Bold"
                fontWeight="bold"
                fontSize={14}
                numberOfLines={1}
                ta="right"
              >
                {feed?.title}
              </Text>
            </XStack>
          )}

          <Link href={`shared/reader?id=${encodeURIComponent(playing.id)}`}>
            <XStack>
              <Text
                fontFamily="Gilroy-Bold"
                fontWeight="bold"
                fontSize={16}
                numberOfLines={1}
                color="$color11"
                ellipsizeMode="tail"
              >
                {playing.title}
              </Text>
            </XStack>
          </Link>
        </YStack>
      )}
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
