import EntryList from 'components/EntryList'
import { useAppSelector } from 'store/hooks'
import { YStack } from 'tamagui'

export default function Bookmarks() {
  const entries = useAppSelector((state) => state.feed.bookmarked)
  return (
    <YStack flex={1}>
      <EntryList entries={entries} type="bookmarks" />
    </YStack>
  )
}
