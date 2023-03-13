import { YStack } from 'tamagui'
import { useEffect } from 'react'
import EntryList from 'components/EntryList'
import { fetchFeedFlow, tagFeedEntries } from 'lib/task'
import { useAppSelector } from 'store/hooks'
import dayjs from 'dayjs'
import _ from 'lodash'
import { FeedEntry } from 'types'

export default function FlowPage() {
  const compactEntries = useAppSelector((state) =>
    state.feed.flow.map((t) => t.entries || [])
  )
  const sources = useAppSelector((state) => state.feed.sources)
  useEffect(() => {
    fetchFeedFlow()
  }, [sources.length])

  useEffect(() => {
    tagFeedEntries()
  }, [compactEntries.length])

  const entries = _.flatten(compactEntries).sort((a: FeedEntry, b: FeedEntry) =>
    dayjs(b.published).diff(dayjs(a.published))
  )
  return (
    <YStack flex={1} backgroundColor="$background">
      <EntryList entries={entries} />
    </YStack>
  )
}
