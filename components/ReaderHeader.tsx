import { useRouter } from 'expo-router'
import { Compass } from 'iconoir-react-native'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, useWindowDimensions, XStack } from 'tamagui'
import { Feed, FeedEntry } from 'types'
import * as WebBrowser from 'expo-web-browser'
import { BlurView } from 'expo-blur'
import useTheme from 'hooks/useTheme'
import Favicon from './Favicon'
import { MAIN_COLOR } from 'lib/constants'

export default function ReaderHeader({
  feed,
  entry,
}: {
  feed?: Feed
  entry?: FeedEntry
}) {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const router = useRouter()
  const theme = useTheme()
  return (
    <BlurView
      intensity={50}
      tint={theme}
      style={{ width, position: 'relative', left: -16, top: -16 }}
    >
      <XStack
        space
        px={16}
        py={4}
        pt={insets.top + 4}
        ai="center"
        jc="space-between"
        w={width}
      >
        {feed ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: 'shared/feed',
                params: {
                  url: encodeURIComponent(feed.url),
                },
              })
            }
          >
            <XStack space={8} alignItems="center">
              <Favicon favicon={feed.favicon} />
              <Text fontWeight="bold" fontSize={20} color={MAIN_COLOR}>
                {feed.title}
              </Text>
            </XStack>
          </Pressable>
        ) : (
          <XStack></XStack>
        )}
        <XStack space={8}>
          {(entry?.link || entry?.id.startsWith('http')) && (
            <Pressable
              onPress={() =>
                WebBrowser.openBrowserAsync(entry.link || entry?.id)
              }
            >
              <Compass width={24} height={24} color="gray" />
            </Pressable>
          )}
        </XStack>
      </XStack>
    </BlurView>
  )
}
