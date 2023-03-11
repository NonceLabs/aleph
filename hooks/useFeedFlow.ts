import dayjs from 'dayjs'
import { extract } from 'lib/parser'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useAppSelector } from 'store/hooks'
import { FeedEntry, Source } from 'types'

async function fetchFeedFlow(sources: Source[]): Promise<FeedEntry[]> {
  try {
    const result = await Promise.all(
      sources.map(async (source) => {
        try {
          const result = await extract(source.url)
          return result.entries
        } catch (error) {
          return []
        }
      })
    )
    return result.flat()
  } catch (error) {
    return []
  }
}

export default function useFeedFlow() {
  const [feedFlow, setFeedFlow] = useState<(FeedEntry | string)[]>([])
  const [loading, setLoading] = useState(true)
  const sources = useAppSelector((state) => state.feed.sources)

  useEffect(() => {
    setLoading(true)
    fetchFeedFlow(sources).then((result) => {
      setFeedFlow(result)
      const grouped = _.groupBy(result, (entry) => {
        return dayjs(entry.published).format('MMM DD')
      })
      const arr: (FeedEntry | string)[] = []
      Object.entries(grouped).forEach(([key, value]) => {
        arr.push(key)
        arr.push(...value.sort((a, b) => dayjs(b.published).diff(a.published)))
      })
      setFeedFlow(arr)
      setLoading(false)
    })
  }, [sources])

  return { feedFlow, loading }
}
