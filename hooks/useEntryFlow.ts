import * as PubSub from 'pubsub-js'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { FeedEntry, PubEvent, Source } from 'types'
import { markAllRead, readEntries } from 'lib/db'

export default function useEntryFlow() {
  const [entries, setEntries] = useState<FeedEntry[]>([])

  const onRead = (rows: FeedEntry[]) => {
    setEntries(
      entries.map((t) => {
        const row = rows.find((r) => r.id === t.id)
        return row ? row : t
      })
    )
    readEntries(rows)
  }

  const onReadAll = () => {
    setEntries(
      entries.map((t) => {
        return { ...t, read: true }
      })
    )
    markAllRead()
  }

  useEffect(() => {
    const listener = PubSub.subscribe(
      PubEvent.ENTRYFLOW_UPDATE,
      (_, rows: FeedEntry[]) => {
        setEntries(rows)
      }
    )

    return () => {
      listener && PubSub.unsubscribe(listener)
    }
  }, [])

  return {
    entries,
    onRead,
    markAllRead,
  }
}
