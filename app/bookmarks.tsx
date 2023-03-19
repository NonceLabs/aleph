import DrawerHeader from 'components/DrawerHeader'
import SimpleEntryList from 'components/SimpleEntryList'
import useBookmarks from 'hooks/useBookmarks'
import { getBookmarkedEntries } from 'lib/db'
import { useEffect, useState } from 'react'
import { YStack } from 'tamagui'

export default function Bookmarks() {
  const [refreshing, setRefreshing] = useState(false)
  const { entries } = useBookmarks()

  useEffect(() => {
    getBookmarkedEntries()
  }, [])

  return (
    <YStack flex={1}>
      <DrawerHeader title="Bookmarks" />
      <SimpleEntryList
        entries={entries}
        refreshing={refreshing}
        onRefresh={async () => {
          try {
            setRefreshing(true)
            await getBookmarkedEntries()
            setRefreshing(false)
          } catch (error) {
            setRefreshing(false)
          }
        }}
        type="bookmarks"
      />
    </YStack>
  )
}
