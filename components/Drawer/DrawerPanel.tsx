import { Tags } from '@tamagui/lucide-icons'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import useTheme from 'hooks/useTheme'
import {
  BookmarkEmpty,
  Home,
  Label,
  Planet,
  RssFeedTag,
  Settings,
} from 'iconoir-react-native'
import { MAIN_COLOR } from 'lib/constants'
import icons from 'lib/icons'
import Toast from 'lib/toast'
import { useState } from 'react'
import { Platform, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useActiveTrack } from 'react-native-track-player'
import { useAppDispatch } from 'store/hooks'
import { Text, XStack, YStack } from 'tamagui'
import { PubEvent } from 'types'

const routes = [
  {
    href: '/',
    title: 'Home',
    Icon: Home,
  },
  {
    href: '/tags',
    title: 'Tags',
    Icon: Label,
  },
  {
    href: '/feeds',
    title: 'Feeds',
    Icon: RssFeedTag,
  },
  {
    href: '/explore',
    title: 'Explore',
    Icon: Planet,
  },
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
  const [count, setCount] = useState(0)
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const fontSize = 32

  const onPlayInfo = () => {
    PubSub.publish(PubEvent.ON_PODCAST_PORTAL)
  }

  const currentTrack = useActiveTrack()

  const dispatch = useAppDispatch()
  const onClick = async () => {
    setCount(count + 1)
    if (count + 1 > 7) {
      setCount(0)
      dispatch({
        type: 'setting/purchased',
        payload: true,
      })
      Toast.success('Purchased successfully! Enjoy the app!')
    }
  }

  return (
    <YStack
      flex={1}
      pt={insets.top}
      space
      px={8}
      jc="space-between"
      pb={insets.bottom + (Platform.OS === 'android' ? 20 : 0)}
      bc={theme === 'light' ? '#f6eee3' : '$background'}
    >
      <XStack jc="flex-end">
        <YStack p={10} ai="flex-end" space={4}>
          <Pressable onPress={onClick}>
            <Image source={icons.LOGO} style={{ width: 80, height: 80 }} />
          </Pressable>
          <Text fontFamily={'Poppins'} color={MAIN_COLOR}>
            Aleph Reader
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
                  color={MAIN_COLOR}
                >
                  {title}
                </Text>
                <Icon width={30} height={30} color={MAIN_COLOR} />
              </XStack>
            </Link>
          )
        })}
        <XStack h={60} mt={30}>
          {currentTrack && (
            <Link href="/" onPress={onPlayInfo}>
              <XStack space={8} w={234} ai="center" jc="flex-end" pr={8}>
                <YStack flex={1} ai="flex-end" jc="flex-end" space={8}>
                  <XStack ai="center" jc="flex-end" space={8}>
                    <Text
                      color="$color11"
                      fontFamily="Gilroy-Bold"
                      fontWeight="bold"
                      fontSize={14}
                      numberOfLines={1}
                      ta="right"
                    >
                      {currentTrack.artist}
                    </Text>
                  </XStack>
                  <Text
                    fontFamily="Gilroy-Bold"
                    fontWeight="bold"
                    fontSize={16}
                    numberOfLines={1}
                    color="$color12"
                    ellipsizeMode="tail"
                  >
                    {currentTrack.title}
                  </Text>
                </YStack>
                <Image
                  source={currentTrack.artwork}
                  placeholder={icons.DEFAULT_COVER}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
              </XStack>
            </Link>
          )}
        </XStack>
      </YStack>
    </YStack>
  )
}
