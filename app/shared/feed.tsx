import Header from 'components/Header'
import { Link, useSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { YStack, Text, XStack, Spinner } from 'tamagui'
import { FeedData, FeedListType } from 'types'
import Favicon from 'components/Favicon'
import _ from 'lodash'
import { EmojiLookUp, InfoEmpty } from 'iconoir-react-native'
import AddFeedButton from 'components/AddFeedButton'
import EntryList from 'components/EntryList'
import useFeeds from 'hooks/useFeeds'
import { createEntries, resubFeed, subFeed } from 'lib/db'
import useEntryFlow from 'hooks/useEntryFlow'
import { MAIN_COLOR } from 'lib/constants'
import { extract } from 'lib/task'

export default function FeedProfile() {
  const [feedData, setFeedData] = useState<FeedData>()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const { url, title, from, feedType } = useSearchParams()
  const { feeds } = useFeeds()
  const feed = feeds.find((f) => f.url === url)
  const { entries } = useEntryFlow()

  useEffect(() => {
    setFeedData(undefined)
    setError(undefined)
    if (feed && !feed.deleted) {
      setFeedData({
        feed,
        entries: entries.filter((e) => e.sourceUrl === url),
      })
    } else if (url) {
      setLoading(true)
      extract(url as string)
        .then((res) => {
          setFeedData(res)
          setLoading(false)
          handleSubscribe(res)
        })
        .catch((error) => {
          setError(error)
          setLoading(false)
        })
    }
  }, [url, feed, entries])

  const handleSubscribe = async (fd: FeedData) => {
    try {
      const { feed: _feed, entries } = fd

      if (feed) {
        if (feed.deleted) {
          resubFeed(_feed)
          createEntries(entries)
        }
      } else {
        if (Array.isArray(entries)) {
          createEntries(entries)
        }
        subFeed(_feed)
      }
    } catch (error) {}
  }

  const favicon = feedData?.feed.favicon
  const feedEntries = feedData?.entries || []

  return (
    <YStack flex={1}>
      <Header
        title=""
        back
        center={
          <XStack space={4} alignItems="center">
            <Favicon favicon={favicon} size={24} />
            <Text
              fontSize={20}
              fontWeight="bold"
              color={MAIN_COLOR}
              maxWidth={140}
              numberOfLines={1}
            >
              {title || feedData?.feed.title}
            </Text>
          </XStack>
        }
        right={
          <Link
            href={`shared/feedInfo?url=${encodeURIComponent(url as string)}`}
          >
            <InfoEmpty width={24} height={24} color={MAIN_COLOR} />
          </Link>
        }
      />
      <YStack flex={1}>
        {error && (
          <YStack space={8} ai="center" jc="center" pt={100}>
            <EmojiLookUp
              width={140}
              height={140}
              color="gray"
              strokeWidth={1}
            />
            <Text fontSize={16} color="$gray10">
              Something went wrong with this feed.
            </Text>
            <Text fontSize={16} color="$gray10">
              Please check the URL, and
            </Text>
            <AddFeedButton
              trigger={
                <Pressable>
                  <Text fontSize={16} color="$blue10">
                    add it again
                  </Text>
                </Pressable>
              }
            />
          </YStack>
        )}
        {loading ? (
          <YStack ai="center" jc="center" pt={100}>
            <Spinner size="large" />
            <Text color="$color10">Loading</Text>
          </YStack>
        ) : error ? null : (
          <EntryList
            entries={feedEntries}
            type={(from as FeedListType) || 'tags'}
            withHeader={false}
          />
        )}
      </YStack>
    </YStack>
  )
}
