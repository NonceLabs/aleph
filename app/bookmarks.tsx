import FeedList from 'components/FeedList'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from 'store/hooks'
import { YStack } from 'tamagui'

export default function Bookmarks() {
  const insets = useSafeAreaInsets()
  const feeds = useAppSelector((state) => state.feed.bookmarked)
  return (
    <YStack flex={1} backgroundColor="#f7f6f5">
      <FeedList feeds={feeds} type="bookmarks" />
    </YStack>
  )
}
