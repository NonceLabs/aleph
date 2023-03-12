import FeedList from 'components/FeedList'
import { useAppSelector } from 'store/hooks'
import { YStack } from 'tamagui'

export default function Bookmarks() {
  const feeds = useAppSelector((state) => state.feed.bookmarked)
  return (
    <YStack flex={1}>
      <FeedList feeds={feeds} type="bookmarks" />
    </YStack>
  )
}
