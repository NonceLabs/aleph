import * as PubSub from 'pubsub-js'
import { useEffect, useState } from 'react'
import { FeedEntry, PubEvent } from 'types'

export default function useBookmarks() {
  const [entries, setEntries] = useState<FeedEntry[]>([])

  useEffect(() => {
    const listener = PubSub.subscribe(
      PubEvent.BOOKMARKS_UPDATE,
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
  }
}
