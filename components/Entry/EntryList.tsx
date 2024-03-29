import { useAppSelector } from 'store/hooks'
import { FeedEntry, FeedListType, FeedType, Tag } from 'types'
import { FlashList } from '@shopify/flash-list'
import { Text, useWindowDimensions, XStack, YStack } from 'tamagui'
import EntryItem from './EntryItem'
import { Animated, useAnimatedValue } from 'react-native'
import _ from 'lodash'
import { EmojiSingRightNote } from 'iconoir-react-native'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PAGE_SIZE } from 'lib/constants'
import TagsHeader from './TagsHeader'
import EntryListHeader from './EntryListHeader'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AddFeedButton from './AddFeedButton'
import useFeeds from 'hooks/useFeeds'
import { Eye, Haze, Podcast } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import LottieView from 'lottie-react-native'

const customTags = [
  {
    title: 'Today',
    icon: Haze,
    count: 0,
  },
  {
    title: 'Unread',
    icon: Eye,
    count: 0,
  },
  {
    title: 'Podcast',
    icon: Podcast,
    count: 0,
  },
]

export default function EntryList({
  entries,
  refreshing,
  onRefresh = () => {},
  initing,
}: {
  entries: FeedEntry[]
  refreshing: boolean
  onRefresh?: () => void
  initing: boolean
}) {
  const [page, setPage] = useState(1)
  const listRef = useRef<FlashList<any>>(null)
  const [selectedTag, setSelectedTag] = useState<Tag | undefined>()
  const [keyword, setKeyword] = useState('')
  const { feeds } = useFeeds()
  const { width } = useWindowDimensions()
  const hideRead = useAppSelector((state) => state.setting.flow.hideRead)
  const scrollY = useAnimatedValue(0)
  const insets = useSafeAreaInsets()

  const topTags: Tag[] = useMemo(() => {
    const tags = entries.reduce((acc, cur) => {
      if (cur.tags) {
        cur.tags.forEach((t) => {
          if (typeof t === 'string') {
            if (acc[t]) {
              acc[t] += 1
            } else {
              acc[t] = 1
            }
          }
        })
      }
      return acc
    }, {} as Record<string, number>)
    return Object.keys(tags)
      .map((t) => {
        return {
          title: t,
          count: tags[t],
          icon: null,
        }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [entries])

  const filtered = useMemo(() => {
    let result = entries
    if (keyword) {
      result = entries.filter((t) =>
        t.title?.toLowerCase().includes(keyword.trim().toLowerCase())
      )
    } else if (selectedTag) {
      if (selectedTag.title === 'Today') {
        result = entries.filter((t) => {
          if (t.published) {
            return (
              new Date(t.published).toDateString() === new Date().toDateString()
            )
          }
          return false
        })
      } else if (selectedTag.title === 'Unread') {
        result = entries.filter((t) => !t.read)
      } else if (selectedTag.title === 'Bookmarked') {
      } else if (selectedTag.title === 'Podcast') {
        result = entries.filter((t) => t.entryType === FeedType.Podcast)
      } else {
        result = entries.filter((t) => {
          if (t.tags) {
            return t.tags.includes(selectedTag.title)
          }
          return false
        })
      }
    } else if (hideRead) {
      result = entries.filter((t) => !t.read)
    }
    return ['Header', ...result]
  }, [entries, keyword, hideRead, selectedTag])

  useEffect(() => {
    listRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    })
  }, [selectedTag])

  const isEmpty =
    filtered.length === 0 ||
    (filtered.length === 1 && typeof filtered[0] === 'string')

  return (
    <FlashList
      ref={listRef}
      ListHeaderComponent={
        <EntryListHeader keyword={keyword} setKeyword={setKeyword} />
      }
      scrollEventThrottle={16}
      stickyHeaderIndices={[0]}
      removeClippedSubviews={false}
      extraData={{
        keyword,
        selectedTag,
      }}
      contentContainerStyle={{ paddingBottom: insets.bottom }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      data={filtered.slice(0, page * PAGE_SIZE)}
      keyExtractor={(item, index) => {
        if (typeof item === 'string') {
          return item
        }
        return `${item.id}-${index}`
      }}
      renderItem={({ item }) => {
        if (typeof item === 'string') {
          return (
            <TagsHeader
              tags={[...customTags, ...topTags]}
              selectedTag={selectedTag}
              scrollY={scrollY}
              setSelectedTag={setSelectedTag}
              type="flow"
            />
          )
        }
        return (
          <EntryItem
            item={item}
            feed={feeds.find((t) => t.url === item.feedUrl)}
            type="flow"
          />
        )
      }}
      estimatedItemSize={100}
      onMomentumScrollEnd={({ nativeEvent }) => {
        if (nativeEvent.contentOffset.y > 0) {
          setPage(page + 1)
        }
      }}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListFooterComponent={
        isEmpty ? (
          initing ? (
            <XStack ai="center" jc="center">
              <LottieView
                autoPlay
                loop
                style={{
                  width,
                  height: width,
                }}
                speed={1.4}
                source={require(`../../assets/loading.json`)}
              />
            </XStack>
          ) : (
            <YStack flex={1} ai="center" jc="center" space pt={100}>
              <EmojiSingRightNote
                width={140}
                height={140}
                color="#999"
                strokeWidth={1}
              />
              {feeds.filter((t) => !t.deleted).length === 0 && (
                <YStack space={4} ai="center">
                  <AddFeedButton
                    trigger={
                      <Text
                        color="$blue10"
                        fontSize={18}
                        fontFamily="Gilroy-Bold"
                      >
                        Add feeds
                      </Text>
                    }
                    from="index"
                  />
                  <Text fontSize={16} color="$color11">
                    or
                  </Text>
                  <Link href="/explore">
                    <Text
                      color="$blue10"
                      fontSize={18}
                      fontFamily="Gilroy-Bold"
                    >
                      Explore
                    </Text>
                  </Link>
                </YStack>
              )}
            </YStack>
          )
        ) : null
      }
    />
  )
}
