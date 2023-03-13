import { useAppSelector } from 'store/hooks'
import { FeedEntry, FeedListType, Tag } from 'types'
import { FlashList } from '@shopify/flash-list'
import { Text, YStack } from 'tamagui'
import EntryItem from './EntryItem'
import { Animated, useAnimatedValue } from 'react-native'
import _ from 'lodash'
import {
  BookmarkEmpty,
  EmojiSingRightNote,
  EyeEmpty,
  SeaAndSun,
} from 'iconoir-react-native'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PAGE_SIZE } from 'lib/constants'
import TagsHeader from './TagsHeader'
import FeedListHeader from './FeedListHeader'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CUSTOM_TAGS = {
  flow: [
    {
      title: 'Today',
      icon: SeaAndSun,
      count: 0,
    },
    {
      title: 'Unread',
      icon: EyeEmpty,
      count: 0,
    },
  ],
  bookmarks: [
    {
      title: 'Bookmarked',
      icon: BookmarkEmpty,
      count: 0,
    },
  ],
  tags: [],
}

export default function FeedList({
  feeds,
  type = 'flow',
  withHeader = true,
}: {
  feeds: FeedEntry[]
  type?: FeedListType
  withHeader?: boolean
}) {
  const customTag = CUSTOM_TAGS[type]

  const [page, setPage] = useState(1)
  const listRef = useRef<FlashList<any>>(null)
  const [selectedTag, setSelectedTag] = useState<Tag | undefined>(
    type === 'bookmarks' ? customTag[0] : undefined
  )
  const [keyword, setKeyword] = useState('')
  const sources = useAppSelector((state) => state.feed.sources)
  const hideRead = useAppSelector((state) => state.setting.flow.hideRead)
  const scrollY = useAnimatedValue(0)
  const insets = useSafeAreaInsets()

  const topTags: Tag[] = useMemo(() => {
    const tags = feeds.reduce((acc, cur) => {
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
  }, [feeds])

  const filtered = useMemo(() => {
    let result = feeds
    if (keyword) {
      result = feeds.filter((t) =>
        t.title?.toLowerCase().includes(keyword.trim().toLowerCase())
      )
    } else if (selectedTag) {
      if (selectedTag.title === 'Today') {
        result = feeds.filter((t) => {
          if (t.published) {
            return (
              new Date(t.published).toDateString() === new Date().toDateString()
            )
          }
          return false
        })
      } else if (selectedTag.title === 'Unread') {
        result = feeds.filter((t) => !t.read)
      } else {
        result = feeds.filter((t) => {
          if (t.tags) {
            return t.tags.includes(selectedTag.title)
          }
          return false
        })
      }
    } else if (hideRead && type === 'flow') {
      result = feeds.filter((t) => !t.read)
    }
    if (type === 'flow') {
      return ['Header', ...result]
    }
    return result
  }, [feeds, keyword, hideRead, selectedTag])

  useEffect(() => {
    listRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    })
  }, [selectedTag])

  return (
    <FlashList
      ref={listRef}
      ListHeaderComponent={
        withHeader ? (
          <FeedListHeader keyword={keyword} setKeyword={setKeyword} />
        ) : null
      }
      scrollEventThrottle={16}
      stickyHeaderIndices={withHeader ? [0] : []}
      removeClippedSubviews={false}
      extraData={{
        keyword,
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
              tags={[...customTag, ...topTags]}
              selectedTag={selectedTag}
              scrollY={scrollY}
              setSelectedTag={setSelectedTag}
              type={type}
            />
          )
        }
        return (
          <EntryItem
            item={item}
            source={sources.find((t) => t.url === item.sourceUrl)}
            type={type}
          />
        )
      }}
      estimatedItemSize={100}
      onMomentumScrollEnd={({ nativeEvent }) => {
        if (nativeEvent.contentOffset.y > 0) {
          setPage(page + 1)
        }
      }}
      ListFooterComponent={
        filtered.length === 0 ? (
          <YStack flex={1} ai="center" jc="center" space pt={100}>
            <EmojiSingRightNote
              width={140}
              height={140}
              color="#999"
              strokeWidth={1}
            />
            <Text color="$color11" fontSize={18}>
              {type === 'flow'
                ? "You don't have feeds to read"
                : "You don't have bookmarks"}
            </Text>
          </YStack>
        ) : null
      }
    />
  )
}
