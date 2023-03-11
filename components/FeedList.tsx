import { useAppSelector } from 'store/hooks'
import { FeedEntry } from 'types'
import { FlashList } from '@shopify/flash-list'
import { Button, Input, ScrollView, Text, XStack, YStack } from 'tamagui'
import FeedItem from './FeedItem'
import { Pressable, StyleSheet } from 'react-native'
import _ from 'lodash'
import dayjs from 'dayjs'
import { AlignCenter, AlignRight, Menu } from 'iconoir-react-native'
import { Image } from 'expo-image'
import { BlurView } from 'expo-blur'
import useTheme from 'hooks/useTheme'
import { useRef } from 'react'
import { useScrollToTop } from '@react-navigation/native'

export default function FeedList() {
  const feedflowRef = useRef<FlashList<any>>(null)
  const flow = useAppSelector((state) =>
    state.feed.flow.map((t) => t.entries || [])
  )
  const sources = useAppSelector((state) => state.feed.sources)
  const theme = useTheme()

  useScrollToTop(feedflowRef as any)

  return (
    <FlashList
      ref={feedflowRef}
      ListHeaderComponent={() => {
        return (
          <XStack space={8} flex={1} px={16} alignItems="center">
            <Pressable>
              <Menu width={28} height={28} />
            </Pressable>
            <Input flex={1} borderRadius="50%" height={40} />
          </XStack>
        )
      }}
      stickyHeaderIndices={[0]}
      data={[
        'header',
        ..._.flatten(flow).sort((a: FeedEntry, b: FeedEntry) =>
          dayjs(b.published).diff(dayjs(a.published))
        ),
      ]}
      renderItem={({ item }) => {
        if (typeof item === 'string') {
          return (
            <BlurView intensity={80} tint={theme}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack space={12} flex={1} px={16} alignItems="center" py={16}>
                  {sources.map((t) => {
                    return (
                      <Button key={t.title} height={30} borderRadius="50%">
                        <Text fontSize={16}>{t.title}</Text>
                      </Button>
                    )
                  })}
                </XStack>
              </ScrollView>
            </BlurView>
          )
        }
        return (
          <FeedItem
            item={item}
            source={sources.find((t) => t.url === item.sourceUrl)}
          />
        )
      }}
      estimatedItemSize={100}
    />
  )
}
