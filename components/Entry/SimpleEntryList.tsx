import { FlashList } from '@shopify/flash-list'
import useFeeds from 'hooks/useFeeds'
import { EmojiSingLeftNote } from 'iconoir-react-native'
import { PAGE_SIZE } from 'lib/constants'
import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, YStack } from 'tamagui'
import { FeedEntry, FeedListType } from 'types'
import EntryItem from './EntryItem'

export default function SimpleEntryList({
  entries,
  refreshing,
  onRefresh,
  type,
}: {
  entries: FeedEntry[]
  refreshing?: boolean
  onRefresh?: () => void
  type: FeedListType
}) {
  const [page, setPage] = useState(1)
  const insets = useSafeAreaInsets()
  const { feeds } = useFeeds()
  const isEmpty = entries.length === 0

  return (
    <FlashList
      scrollEventThrottle={16}
      removeClippedSubviews={false}
      contentContainerStyle={{ paddingBottom: insets.bottom }}
      data={entries.slice(0, page * PAGE_SIZE)}
      keyExtractor={(item, index) => {
        if (typeof item === 'string') {
          return item
        }
        return `${item.id}-${index}`
      }}
      renderItem={({ item }) => {
        return (
          <EntryItem
            item={item}
            feed={feeds.find((t) => t.url === item.feedUrl)}
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
      onRefresh={onRefresh}
      refreshing={!!refreshing}
      ListFooterComponent={
        isEmpty ? (
          <YStack flex={1} ai="center" jc="center" space pt={100}>
            <EmojiSingLeftNote
              width={140}
              height={140}
              color="#999"
              strokeWidth={1}
            />
            <Text color="$color11" fontSize={18}>
              No feeds
            </Text>
          </YStack>
        ) : null
      }
    />
  )
}
