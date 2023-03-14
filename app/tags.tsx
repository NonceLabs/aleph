import { FlashList } from '@shopify/flash-list'
import DrawerHeader from 'components/DrawerHeader'
import { Link } from 'expo-router'
import useEntryFlow from 'hooks/useEntryFlow'
import { PAGE_SIZE } from 'lib/constants'
import { useMemo, useState } from 'react'
import { Text, useWindowDimensions, XStack, YStack } from 'tamagui'
import { Tag } from 'types'

export default function TagsPage() {
  const [page, setPage] = useState(1)
  const { entries } = useEntryFlow()
  const { width } = useWindowDimensions()
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
  }, [entries])
  return (
    <YStack flex={1}>
      <DrawerHeader title="Tags" />
      <FlashList
        data={topTags.slice(0, page * PAGE_SIZE)}
        estimatedItemSize={40}
        renderItem={({ item }) => {
          return (
            <Link
              href={`shared/entryByTag?tag=${encodeURIComponent(item.title)}`}
            >
              <XStack ai="center" jc="space-between" w={width} px={20} py={8}>
                <XStack>
                  <Text color="white" fontSize={18}>
                    {item.title}
                  </Text>
                </XStack>
                <Text color="$color11">{item.count}</Text>
              </XStack>
            </Link>
          )
        }}
        onMomentumScrollEnd={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y > 0) {
            setPage(page + 1)
          }
        }}
      />
    </YStack>
  )
}
