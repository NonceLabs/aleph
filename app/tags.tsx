import { FlashList } from '@shopify/flash-list'
import { ChevronRight } from '@tamagui/lucide-icons'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import { Link } from 'expo-router'
import useEntryFlow from 'hooks/useEntryFlow'
import { PAGE_SIZE } from 'lib/constants'
import { useMemo, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, useWindowDimensions, XStack, YStack } from 'tamagui'
import { Tag } from 'types'

export default function TagsPage() {
  const [page, setPage] = useState(1)
  const { entries } = useEntryFlow()
  const { width } = useWindowDimensions()
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
  }, [entries])
  return (
    <YStack flex={1}>
      <DrawerHeader
        title="Tags"
        right={
          <XStack pr={10}>
            <Text color="$blue10" fontWeight="bold">
              {topTags.length}
            </Text>
            <Text color="$color10"> tags in total</Text>
          </XStack>
        }
      />
      <FlashList
        data={topTags.slice(0, page * PAGE_SIZE)}
        estimatedItemSize={40}
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
        renderItem={({ item }) => {
          return (
            <Link
              href={`shared/entryByTag?tag=${encodeURIComponent(
                item.title
              )}&from=tags`}
            >
              <XStack
                ai="center"
                jc="space-between"
                w={width - 32}
                px={20}
                py={8}
                pr={4}
                backgroundColor="$background"
              >
                <Text color="$color12" fontSize={18} fontFamily="Gilroy-Bold">
                  {item.title}
                </Text>
                <XStack ai="center">
                  <Text color="$color11" fontSize={16}>
                    {item.count}
                  </Text>
                  <ChevronRight size={28} color="$color8" />
                </XStack>
              </XStack>
            </Link>
          )
        }}
        ItemSeparatorComponent={() => (
          <YStack height={1} backgroundColor="$borderColor" />
        )}
        onMomentumScrollEnd={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y > 0) {
            setPage(page + 1)
          }
        }}
      />
    </YStack>
  )
}
