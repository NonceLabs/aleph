import { Link } from 'expo-router'
import {
  BookmarkEmpty,
  Home,
  Planet,
  Repository,
  RssFeed,
  RssFeedTag,
  Settings,
} from 'iconoir-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, XStack, YStack } from 'tamagui'

export default function DrawerPanel() {
  const insets = useSafeAreaInsets()
  const fontSize = 32
  return (
    <YStack
      flex={1}
      pt={insets.top}
      pb={insets.bottom}
      space
      px={8}
      justifyContent="center"
    >
      <YStack width="100%" space={8} alignItems="flex-end">
        <Link href="/">
          <XStack space={8} alignItems="center" justifyContent="flex-end">
            <Text
              textAlign="right"
              fontWeight="bold"
              fontSize={fontSize}
              fontFamily="Gilroy-Bold"
              width={200}
            >
              Home
            </Text>
            <Home width={30} height={30} color="black" />
          </XStack>
        </Link>
        <Link href="/feeds">
          <XStack space={8} alignItems="center" justifyContent="flex-end">
            <Text
              textAlign="right"
              fontWeight="bold"
              fontSize={fontSize}
              fontFamily="Gilroy-Bold"
              width={200}
            >
              Feeds
            </Text>
            <RssFeedTag width={30} height={30} color="black" />
          </XStack>
        </Link>
        <XStack space={8} alignItems="center" justifyContent="flex-end">
          <Text
            textAlign="right"
            fontWeight="bold"
            fontSize={fontSize}
            fontFamily="Gilroy-Bold"
            width={200}
          >
            Explore
          </Text>
          <Planet width={30} height={30} color="black" />
        </XStack>
        <Link href="/bookmarks">
          <XStack space={8} alignItems="center" justifyContent="flex-end">
            <Text
              textAlign="right"
              fontWeight="bold"
              fontSize={fontSize}
              fontFamily="Gilroy-Bold"
              width={200}
            >
              Bookmarks
            </Text>
            <BookmarkEmpty width={30} height={30} color="black" />
          </XStack>
        </Link>
        <Link href="/settings">
          <XStack space={8} alignItems="center" justifyContent="flex-end">
            <Text
              textAlign="right"
              fontWeight="bold"
              fontSize={fontSize}
              fontFamily="Gilroy-Bold"
            >
              Settings
            </Text>
            <Settings width={30} height={30} color="black" />
          </XStack>
        </Link>
      </YStack>
    </YStack>
  )
}
