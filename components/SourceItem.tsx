import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'
import { useAppSelector } from 'store/hooks'
import { Text, XStack, YStack } from 'tamagui'
import { Source } from 'types'

export default function SourceItem({
  item,
  onPress,
}: {
  item: Source
  onPress?: () => void
}) {
  const flow = useAppSelector((state) =>
    state.feed.flow.find((t) => t.link === item.link)
  )
  const read = useAppSelector((state) => state.feed.read || [])
  const router = useRouter()

  const unreadCount =
    flow?.entries?.filter((t) => !read.includes(t.id)).length || 0
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: 'feed',
          params: {
            ...item,
            link: item.link ? encodeURIComponent(item.link) : '',
            url: encodeURIComponent(item.url),
            logo: item.logo ? encodeURIComponent(item.logo) : '',
          },
        })
      }}
    >
      <XStack
        space={4}
        alignItems="center"
        paddingVertical={12}
        backgroundColor="white"
        px={12}
        borderRadius={4}
      >
        <Image
          source={{ uri: item.logo }}
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
          }}
        />
        <XStack flex={1} alignItems="center" justifyContent="space-between">
          <Text
            fontSize={16}
            maxWidth={120}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <Text fontSize={14} color="$gray9Light">
            {unreadCount}
          </Text>
        </XStack>
      </XStack>
    </Pressable>
  )
}
