import { updateEntries } from 'lib/db'
import { Observable } from 'lib/obserable'
import * as PubSub from 'pubsub-js'
import { useEffect, useState } from 'react'
import { FeedEntry, PubEvent } from 'types'

const entriesStore = new Observable<FeedEntry[]>([])

export default function useBookmarks() {
  const [entries, setEntries] = useState<FeedEntry[]>(entriesStore.get())

  const onUpdateEntries = (_entries: FeedEntry[]) => {
    entriesStore.set(
      entries.map((e) => {
        const entry = _entries.find((t) => t.id === e.id)
        if (entry) {
          return entry
        }
        return e
      })
    )
    updateEntries(_entries)
  }

  useEffect(() => {
    return entriesStore.subscribe(setEntries)
  }, [])

  useEffect(() => {
    const listener = PubSub.subscribe(
      PubEvent.BOOKMARKS_UPDATE,
      (_, rows: FeedEntry[]) => {
        entriesStore.set(rows)
      }
    )

    return () => {
      listener && PubSub.unsubscribe(listener)
    }
  }, [])

  return {
    entries,
    onUpdateEntries,
  }
}
