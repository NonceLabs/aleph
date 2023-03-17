import { Image } from 'expo-image'
import { Link } from 'expo-router'
import useFeed from 'hooks/useFeed'
import useTheme from 'hooks/useTheme'
import {
  BookmarkEmpty,
  Home,
  Label,
  RssFeedTag,
  Settings,
} from 'iconoir-react-native'
import { MAIN_COLOR } from 'lib/constants'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from 'store/hooks'
import { Text, XStack, YStack } from 'tamagui'
import { PubEvent } from 'types'

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

export default function DrawerPanel() {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const fontSize = 32

  const { playing } = useAppSelector((state) => state.feed)
  const feed = useFeed(playing?.feedUrl)

  const onPlayInfo = () => {
    PubSub.publish(PubEvent.ON_PODCAST_PORTAL)
  }

  const cover = playing?.cover || feed?.favicon

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
          <Text fontFamily={'Poppins'} color={MAIN_COLOR}>
            Aleph Reader
          </Text>
        </YStack>
      </XStack>
      {playing && (
        <Link href="/" onPress={onPlayInfo}>
          <XStack space={8} w={234} ai="center" jc="flex-end" pr={8}>
            <YStack flex={1} ai="flex-end" jc="flex-end" space={8}>
              {feed && (
                <XStack ai="center" jc="flex-end" space={8}>
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
            </YStack>
            <Image
              source={cover}
              placeholder={require('../assets/images/cover.png')}
              style={{ width: 60, height: 60, borderRadius: 8 }}
            />
          </XStack>
        </Link>
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
                  color={MAIN_COLOR}
                >
                  {title}
                </Text>
                <Icon width={30} height={30} color={MAIN_COLOR} />
              </XStack>
            </Link>
          )
        })}
      </YStack>
    </YStack>
  )
}
