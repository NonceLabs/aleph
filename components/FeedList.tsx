import { useAppSelector } from 'store/hooks'
import { FeedEntry, Tag } from 'types'
import { FlashList } from '@shopify/flash-list'
import { Input, XStack } from 'tamagui'
import EntryItem from './EntryItem'
import { Animated, FlatList, Pressable, useAnimatedValue } from 'react-native'
import _ from 'lodash'
import { BookmarkEmpty, Menu, SeaAndSun } from 'iconoir-react-native'
import { useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { PAGE_SIZE } from 'lib/constants'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TagsHeader from './TagsHeader'
import FeedListHeader from './FeedListHeader'

export default function FeedList({
  feeds,
  type = 'flow',
}: {
  feeds: FeedEntry[]
  type?: 'flow' | 'bookmarks'
}) {
  const customTag =
    type === 'flow'
      ? {
          title: 'Today',
          icon: SeaAndSun,
          count: 0,
        }
      : {
          title: 'Bookmarked',
          icon: BookmarkEmpty,
          count: 0,
        }

  const [page, setPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState<Tag | undefined>(
    type === 'bookmarks' ? customTag : undefined
  )
  const [keyword, setKeyword] = useState('')
  const sources = useAppSelector((state) => state.feed.sources)
  const scrollY = useAnimatedValue(0)

  const topTags: Tag[] = []

  let filtered = [...feeds]

  if (keyword) {
    filtered = feeds.filter((t) =>
      t.title?.toLowerCase().includes(keyword.trim().toLowerCase())
    )
  } else if (selectedTag) {
    if (selectedTag.title === 'Today') {
      filtered = feeds.filter((t) => {
        if (t.published) {
          return (
            new Date(t.published).toDateString() === new Date().toDateString()
          )
        }
        return false
      })
    }
  }

  return (
    <FlashList
      ListHeaderComponent={
        <FeedListHeader keyword={keyword} setKeyword={setKeyword} />
      }
      scrollEventThrottle={16}
      stickyHeaderIndices={[0]}
      removeClippedSubviews={false}
      extraData={{
        keyword,
        selectedTag,
      }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      data={['header', ...filtered.slice(0, page * PAGE_SIZE)]}
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
              tags={[customTag, ...topTags]}
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
          />
        )
      }}
      estimatedItemSize={100}
      onMomentumScrollEnd={({ nativeEvent }) => {
        if (nativeEvent.contentOffset.y > 0) {
          setPage(page + 1)
        }
      }}
    />
  )
}
