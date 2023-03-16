import DrawerHeader from 'components/DrawerHeader'
import EntryList from 'components/EntryList'
import { useNavigation } from 'expo-router'
import useBookmarks from 'hooks/useBookmarks'
import { getBookmarkedEntries } from 'lib/db'
import { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'

export default function Bookmarks() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const { entries } = useBookmarks()

  useEffect(() => {
    getBookmarkedEntries()
  }, [])

  return (
    <YStack flex={1}>
      <DrawerHeader title="Bookmarks" />
      <EntryList
        entries={entries}
        type="bookmarks"
        withHeader={false}
        onRefresh={getBookmarkedEntries}
      />
    </YStack>
  )
}
