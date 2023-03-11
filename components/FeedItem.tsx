import dayjs from 'dayjs'
import { Image } from 'expo-image'
import { YStack, H6, Text, XStack } from 'tamagui'
import { FeedEntry, Source } from 'types'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

dayjs.extend(relativeTime)

export default function FeedItem({
  item,
  source,
}: {
  item: FeedEntry
  source?: Source
}) {
  const router = useRouter()
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: 'article',
          params: {
            id: encodeURIComponent(item.id),
          },
        })
      }}
    >
      <YStack
        paddingVertical={10}
        paddingHorizontal={16}
        space={4}
        borderBottomWidth={StyleSheet.hairlineWidth}
        borderBottomColor="$borderColor"
      >
        {source && (
          <XStack space={4} alignItems="center">
            {source.logo && (
              <Image
                source={source.logo}
                style={{ width: 20, height: 20, borderRadius: 4 }}
              />
            )}
            <Text>{source.title}</Text>
            <Text fontSize={12} color="$gray10" marginLeft={10}>
              {dayjs(item.published).fromNow()}
            </Text>
          </XStack>
        )}
        <Text fontSize={18} fontWeight="600" lineHeight={20}>
          {item.title}
        </Text>
        <XStack space></XStack>
      </YStack>
    </Pressable>
  )
}
