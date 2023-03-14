import * as PubSub from 'pubsub-js'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Feed, PubEvent } from 'types'
import { Observable } from 'lib/obserable'

const feedsStore = new Observable<Feed[]>([])

export default function useFeeds() {
  const [feeds, setFeeds] = useState<Feed[]>(feedsStore.get())

  useEffect(() => {
    return feedsStore.subscribe(setFeeds)
  }, [])

  useEffect(() => {
    const listener = PubSub.subscribe(
      PubEvent.FEEDS_UPDATE,
      (_, rows: Feed[]) => {
        feedsStore.set(rows)
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
