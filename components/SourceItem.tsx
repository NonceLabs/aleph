import { useRouter } from 'expo-router'
import useEntryFlow from 'hooks/useEntryFlow'
import { Pressable } from 'react-native'
import { Text, XStack } from 'tamagui'
import { Feed } from 'types'
import Favicon from './Favicon'

export default function SourceItem({
  item,
  onPress,
}: {
  item: Feed
  onPress?: () => void
}) {
  const router = useRouter()
  const { entries } = useEntryFlow()
  const unreadCount =
    entries.filter((t) => !t.read && t.feedUrl === item.url).length || 0

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: 'shared/feed',
          params: {
            url: encodeURIComponent(item.url),
            from: 'feeds',
          },
        })
      }}
      style={{ marginTop: 4 }}
    >
      <XStack
        space={8}
        alignItems="center"
        paddingVertical={12}
        backgroundColor="$background"
        px={12}
        mx={16}
        borderRadius={4}
      >
        <Favicon favicon={item.favicon} />
        <XStack flex={1} alignItems="center" justifyContent="space-between">
          <Text
            fontSize={16}
            maxWidth={180}
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
