import { useAppSelector } from 'store/hooks'
import { FeedEntry, Tag } from 'types'
import { FlashList } from '@shopify/flash-list'
import { Input, XStack } from 'tamagui'
import EntryItem from './EntryItem'
import { Animated, Pressable, useAnimatedValue } from 'react-native'
import _ from 'lodash'
import { BookmarkEmpty, Menu, SeaAndSun } from 'iconoir-react-native'
import { useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { PAGE_SIZE } from 'lib/constants'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TagsHeader from './TagsHeader'

export default function FeedList({
  feeds,
  type = 'flow',
}: {
  feeds: FeedEntry[]
  type?: 'flow' | 'bookmarks'
}) {
  const [page, setPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState<Tag>()
  const sources = useAppSelector((state) => state.feed.sources)
  const insets = useSafeAreaInsets()
  const scrollY = useAnimatedValue(0)

  const navigation = useNavigation()

  const customTags = [
    {
      title: type === 'flow' ? 'Today' : 'Bookmarked',
      icon: type === 'flow' ? SeaAndSun : BookmarkEmpty,
      count: 0,
    },
  ]
  const topTags = [
    {
      title: 'SVB',
      count: 12,
      icon: null,
    },
    {
      title: 'Binance',
      count: 7,
      icon: null,
    },
    {
      title: 'Disney',
      count: 7,
      icon: null,
    },
  ]

  return (
    <FlashList
      ListHeaderComponent={() => {
        return (
          <XStack
            space={8}
            flex={1}
            px={16}
            alignItems="center"
            pt={insets.top}
          >
            <Pressable
              onPress={() => {
                // @ts-ignore
                navigation.openDrawer()
              }}
            >
              <Menu width={28} height={28} />
            </Pressable>
            <Input flex={1} borderRadius={20} height={40} />
          </XStack>
        )
      }}
      scrollEventThrottle={16}
      stickyHeaderIndices={[0]}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      data={['header', ...feeds.slice(0, page * PAGE_SIZE)]}
      renderItem={({ item }) => {
        if (typeof item === 'string') {
          return (
            <TagsHeader
              tags={[...customTags, ...topTags]}
              selectedTag={selectedTag}
              scrollY={scrollY}
              setSelectedTag={setSelectedTag}
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
