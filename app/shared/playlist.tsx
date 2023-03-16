import DrawerHeader from 'components/DrawerHeader'
import EntryList from 'components/EntryList'
import { useAppSelector } from 'store/hooks'
import { YStack } from 'tamagui'

export default function Playlist() {
  const { playlist } = useAppSelector((state) => state.feed)
  return (
    <YStack flex={1}>
      <DrawerHeader title="Playlist" />
      <EntryList entries={playlist} type="bookmarks" withHeader={false} />
    </YStack>
  )
}
