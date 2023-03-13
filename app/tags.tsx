import FeedList from 'components/FeedList'
import dayjs from 'dayjs'
import { useRouter, useSearchParams } from 'expo-router'
import { NavArrowLeft } from 'iconoir-react-native'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from 'store/hooks'
import { XStack, YStack, Text, Input } from 'tamagui'
import { FeedEntry } from 'types'

export default function Tags() {
  const [tag, setTag] = useState('')
  const { tag: _tag } = useSearchParams()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const entries = useAppSelector((state) =>
    state.feed.flow.map((t) => t.entries || [])
  )
  const feeds = _.flatten(entries)
    .filter((t) => t.tags?.includes(tag))
    .sort((a: FeedEntry, b: FeedEntry) =>
      dayjs(b.published).diff(dayjs(a.published))
    )

  useEffect(() => {
    if (typeof _tag === 'string') {
      setTag(_tag)
    }
  }, [_tag])

  console.log('feeds', feeds.length)

  return (
    <YStack flex={1}>
      <XStack pt={insets.top} space={4} ai="center" pr={16}>
        <Pressable onPress={() => router.back()}>
          <XStack alignItems="center">
            <NavArrowLeft width={32} height={32} />
          </XStack>
        </Pressable>
        <XStack ai="center" flex={1}>
          <Input flex={1} value={`#${tag as string}`} fontSize="$5" disabled />
        </XStack>
      </XStack>
      <XStack ai="center" jc="center" space={4} py={8} o={0.7}>
        <Text fontWeight="600" color="$blue11">
          {feeds.length}
        </Text>
        <Text>article{feeds.length > 1 ? 's' : ''} found</Text>
      </XStack>
      <FeedList feeds={feeds} type="tags" withHeader={false} />
    </YStack>
  )
}
