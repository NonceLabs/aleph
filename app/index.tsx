import { YStack } from 'tamagui'
import { useEffect, useState } from 'react'
import EntryList from 'components/Entry/EntryList'
import { fetchFeedFlow, tagFeedEntries } from 'lib/task'
import _ from 'lodash'
import { initSQLite } from 'lib/db'
import useFeeds from 'hooks/useFeeds'
import useEntryFlow from 'hooks/useEntryFlow'
import useBookmarks from 'hooks/useBookmarks'
import useQueue from 'hooks/useQueue'
import { fetcher } from 'lib/request'
import { HOST } from 'lib/constants'
import { useAppDispatch } from 'store/hooks'

export default function FlowPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [initing, setIniting] = useState(false)
  const { feeds } = useFeeds()
  const { entries } = useEntryFlow()
  useBookmarks()
  useQueue()

  const dispatch = useAppDispatch()
  useEffect(() => {
    fetcher(`${HOST}/explore`).then((res) => {
      dispatch({
        type: 'feed/setExplore',
        payload: res,
      })
    })

    setTimeout(() => {
      initSQLite()
    }, 300)
    setIniting(true)
    setTimeout(() => {
      setIniting(false)
    }, 3000)
  }, [])

  useEffect(() => {
    fetchFeedFlow(feeds.filter((t) => !t.deleted))
  }, [feeds.filter((t) => !t.deleted).length])

  useEffect(() => {
    tagFeedEntries(entries)
  }, [entries.length])

  return (
    <YStack flex={1} backgroundColor="$background">
      <EntryList
        entries={entries}
        onRefresh={async () => {
          try {
            setRefreshing(true)
            setTimeout(() => {
              setRefreshing(false)
            }, 3000)
            await fetchFeedFlow(feeds.filter((t) => !t.deleted))
            setRefreshing(false)
          } catch (error) {
            setRefreshing(false)
          }
        }}
        refreshing={refreshing}
        initing={initing}
      />
    </YStack>
  )
}
