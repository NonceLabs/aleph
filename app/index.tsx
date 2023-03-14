import { YStack } from 'tamagui'
import { useEffect } from 'react'
import EntryList from 'components/EntryList'
import { fetchFeedFlow, tagFeedEntries } from 'lib/task'
import _ from 'lodash'
import { initSQLite } from 'lib/db'
import useFeeds from 'hooks/useFeeds'
import useEntryFlow from 'hooks/useEntryFlow'
import useBookmarks from 'hooks/useBookmarks'

export default function FlowPage() {
  const { feeds } = useFeeds()
  const { entries } = useEntryFlow()
  useBookmarks()

  useEffect(() => {
    setTimeout(() => {
      initSQLite()
    }, 300)
  }, [])

  useEffect(() => {
    fetchFeedFlow(feeds)
  }, [feeds.filter((t) => !t.deleted).length])

  useEffect(() => {
    tagFeedEntries(entries)
  }, [entries.length])

  return (
    <YStack flex={1} backgroundColor="$background">
      <EntryList entries={entries} />
    </YStack>
  )
}
