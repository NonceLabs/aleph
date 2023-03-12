import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'
import { useAppSelector } from 'store/hooks'
import { Text, XStack } from 'tamagui'
import { Source } from 'types'
import Favicon from './Favicon'

export default function SourceItem({
  item,
  onPress,
}: {
  item: Source
  onPress?: () => void
}) {
  const feedData = useAppSelector((state) =>
    state.feed.flow.find((t) => t.url === item.url)
  )
  const router = useRouter()

  const unreadCount = feedData?.entries?.filter((t) => !t.read).length || 0

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
        space={8}
        alignItems="center"
        paddingVertical={12}
        backgroundColor="$background"
        px={12}
        borderRadius={4}
      >
        <Favicon favicon={item.logo} />
        <XStack flex={1} alignItems="center" justifyContent="space-between">
          <Text
            fontSize={16}
            maxWidth={120}
            numberOfLines={1}
            ellipsizeMode="tail"
            color="$color11"
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
