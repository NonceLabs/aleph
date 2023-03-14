import * as PubSub from 'pubsub-js'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Feed, PubEvent } from 'types'

export default function useFeeds() {
  const [feeds, setFeeds] = useState<Feed[]>([])

  useEffect(() => {
    const listener = PubSub.subscribe(
      PubEvent.FEEDS_UPDATE,
      (_, rows: Feed[]) => {
        setFeeds(rows)
      }
    )

    return () => {
      listener && PubSub.unsubscribe(listener)
    }
  }, [])

  return {
    feeds,
  }
}
