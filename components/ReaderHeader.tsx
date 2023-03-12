import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Compass } from 'iconoir-react-native'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, XStack } from 'tamagui'
import { FeedEntry, Source } from 'types'
import * as WebBrowser from 'expo-web-browser'

export default function ReaderHeader({
  source,
  item,
}: {
  source?: Source
  item?: FeedEntry
}) {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  return (
    <XStack
      space
      px={16}
      py={4}
      w="100%"
      pt={insets.top + 4}
      ai="center"
      jc="space-between"
      bc="$background"
    >
      {source && (
        <Pressable
          onPress={() =>
            router.push({
              pathname: 'feed',
              params: {
                ...source,
                id: '',
                link: source.link ? encodeURIComponent(source.link) : '',
                url: encodeURIComponent(source.url),
                logo: source.logo ? encodeURIComponent(source.logo) : '',
              },
            })
          }
        >
          <XStack space={8} alignItems="center">
            {source?.logo && (
              <Image
                source={source?.logo}
                style={{ width: 24, height: 24, borderRadius: 4 }}
              />
            )}
            <Text fontWeight="bold" fontSize={20} color="$blue10Light">
              {source.title}
            </Text>
          </XStack>
        </Pressable>
      )}
      <XStack space={8}>
        {(item?.link || item?.id.startsWith('http')) && (
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync(item.link || item?.id)}
          >
            <Compass width={24} height={24} color="gray" />
          </Pressable>
        )}
      </XStack>
    </XStack>
  )
}
