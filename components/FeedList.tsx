import { useAppSelector } from 'store/hooks'
import { FeedEntry } from 'types'
import { FlashList } from '@shopify/flash-list'
import { Button, Input, ScrollView, Text, XStack } from 'tamagui'
import EntryItem from './EntryItem'
import { Pressable } from 'react-native'
import _ from 'lodash'
import { Menu } from 'iconoir-react-native'
import { BlurView } from 'expo-blur'
import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import { useNavigation } from 'expo-router'
import { PAGE_SIZE } from 'lib/constants'

export default function FeedList({ feeds }: { feeds: FeedEntry[] }) {
  const [page, setPage] = useState(1)
  const sources = useAppSelector((state) => state.feed.sources)
  const theme = useTheme()

  const navigation = useNavigation()

  return (
    <FlashList
      ListHeaderComponent={() => {
        return (
          <XStack space={8} flex={1} px={16} alignItems="center">
            <Pressable
              onPress={() => {
                // @ts-ignore
                navigation.openDrawer()
              }}
            >
              <Menu width={28} height={28} />
            </Pressable>
            <Input flex={1} borderRadius="50%" height={40} />
          </XStack>
        )
      }}
      stickyHeaderIndices={[0]}
      data={['header', ...feeds.slice(0, page * PAGE_SIZE)]}
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
