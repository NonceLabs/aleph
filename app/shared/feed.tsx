import Header from 'components/Header'
import { Link, useSearchParams } from 'expo-router'
import { extract } from 'lib/parser'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { YStack, Text, XStack, Spinner } from 'tamagui'
import { Feed, FeedData, FeedEntry, FeedListType, FeedType } from 'types'
import Favicon from 'components/Favicon'
import _ from 'lodash'
import { EmojiLookUp, InfoEmpty } from 'iconoir-react-native'
import AddFeedButton from 'components/AddFeedButton'
import EntryList from 'components/EntryList'
import useFeeds from 'hooks/useFeeds'
import { createEntries, resubFeed, subFeed } from 'lib/db'
import useEntryFlow from 'hooks/useEntryFlow'
import { MAIN_COLOR } from 'lib/constants'

export default function FeedProfile() {
  const [data, setData] = useState<FeedData>()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const { url, title, from, feedType } = useSearchParams()
  const { feeds } = useFeeds()
  const feed = feeds.find((f) => f.url === url)
  const { entries } = useEntryFlow()

  useEffect(() => {
    setData(undefined)
    setError(undefined)
    if (feed) {
      setData(feed)
    } else if (url) {
      setLoading(true)
      extract(url as string)
        .then((res) => {
          if (res) {
            const fd = {
              ...res,
              url,
              entries: res?.entries.map((t: FeedEntry) => ({
                ...t,
                sourceUrl: url,
              })),
            }
            setData(fd)
            // auto sub
            handleSubscribe(fd)
          }
          setLoading(false)
        })
        .catch((error) => {
          setError(error)
          setLoading(false)
        })
    }
  }, [url, feed])

  const handleSubscribe = async (fd: FeedData) => {
    try {
      const _feed: Feed = {
        url: fd.url!,
        title: fd.title || '',
        favicon: fd.favicon || '',
        description: fd.description || '',
        language: fd.language || '',
        type: (feedType as FeedType) || FeedType.RSS,
      }

      if (feed) {
        if (feed.deleted) {
          resubFeed(_feed)
        }
      } else {
        if (Array.isArray(fd?.entries)) {
          createEntries(fd.entries)
        }
        subFeed(_feed)
      }
    } catch (error) {}
  }

  const favicon = feed?.favicon || data?.favicon
  const isSubed = feed && !feed?.deleted
  const feedEntries = isSubed
    ? entries.filter((e) => e.sourceUrl === url)
    : data?.entries || []

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
              {title || data?.title}
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
