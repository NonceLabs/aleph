import Header from 'components/Header'
import { Link, useNavigation, useRouter, useSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { YStack, Text, XStack, Spinner } from 'tamagui'
import { Feed, FeedData, FeedListType } from 'types'
import Favicon from 'components/Favicon'
import _ from 'lodash'
import { EmojiLookUp } from 'iconoir-react-native'
import AddFeedButton from 'components/Entry/AddFeedButton'
import { MAIN_COLOR } from 'lib/constants'
import { extract } from 'lib/task'
import { Info } from '@tamagui/lucide-icons'
import useFeed from 'hooks/useFeed'
import SimpleEntryList from 'components/Entry/SimpleEntryList'
import FeedSheet from 'components/Entry/FeedSheet'
import useEntryFlow from 'hooks/useEntryFlow'

export default function FeedProfile() {
  const [feedData, setFeedData] = useState<FeedData>()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [feed, setFeed] = useState<Feed>()
  const { url, from } = useSearchParams()
  const oldSub = useFeed(url as string)
  const { entries } = useEntryFlow()

  const navigation = useNavigation()
  const router = useRouter()

  useEffect(() => {
    if (oldSub && !feedData) {
      if (oldSub.deleted) {
        // open the sheet
        setFeed(oldSub)
      } else {
        setFeedData({
          feed: oldSub,
          entries: entries.filter((e) => e.feedUrl === oldSub.url),
        })
      }
    }
  }, [oldSub])

  useEffect(() => {
    if (!oldSub || oldSub.deleted) {
      setFeedData(undefined)
      setError(undefined)
      setLoading(true)
      extract(url as string)
        .then((res) => {
          setFeedData(res)
          if (!oldSub) {
            setFeed(res.feed)
          }
          setLoading(false)
        })
        .catch((error) => {
          setError(error)
          setLoading(false)
        })
    }
  }, [url, oldSub])

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setFeed(undefined)
    }
  }

  const favicon = feedData?.feed?.favicon || oldSub?.favicon
  const title = feedData?.feed?.title || oldSub?.title
  const feedEntries = feedData?.entries || []

  return (
    <YStack flex={1}>
      <Header
        title=""
        back
        onBack={() => {
          if (from === 'feeds') {
            // @ts-ignore
            navigation.jumpTo(from)
          } else if (from === 'index') {
            // @ts-ignore
            navigation.jumpTo('index')
          } else {
            router.back()
          }
        }}
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
              {title}
            </Text>
          </XStack>
        }
        right={
          oldSub && !oldSub.deleted ? (
            <Link
              href={`shared/feedInfo?url=${encodeURIComponent(url as string)}`}
            >
              <Info width={24} height={24} color={MAIN_COLOR} />
            </Link>
          ) : feedData ? (
            <Pressable onPress={() => setFeed(feedData.feed)}>
              <Info width={24} height={24} color={MAIN_COLOR} />
            </Pressable>
          ) : null
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
              from={from as string}
            />
          </YStack>
        )}
        {loading ? (
          <YStack ai="center" jc="center" pt={100}>
            <Spinner size="large" />
            <Text color="$color10">Loading</Text>
          </YStack>
        ) : error ? null : (
          <SimpleEntryList
            entries={feedEntries}
            type={from as FeedListType}
            onRefresh={() => {}}
          />
        )}
      </YStack>
      <FeedSheet feed={feed} onOpenChange={onOpenChange} />
    </YStack>
  )
}
