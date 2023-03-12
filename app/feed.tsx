import Header from 'components/Header'
import { useSearchParams } from 'expo-router'
import { extract } from 'lib/parser'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Anchor, YStack, H6, Text, Button, XStack } from 'tamagui'
import { FeedData } from 'types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { useAppSelector } from 'store/hooks'
import FeedItem from 'components/FeedItem'
import Favicon from 'components/Favicon'

export default function FeedProfile() {
  const [data, setData] = useState<FeedData>()
  const { url, title, description, logo, link } = useSearchParams()
  const insets = useSafeAreaInsets()
  const sources = useAppSelector((state) => state.feed.sources)
  useEffect(() => {
    if (url) {
      extract(url as string)
        .then((res) => {
          setData(res)
        })
        .catch(console.log)
    }
  }, [url])

  const isFollowed = sources.some((source) => source.url === url)

  return (
    <YStack flex={1}>
      <Header
        title="Back"
        back
        center={
          <XStack space={4} alignItems="center">
            <Favicon favicon={logo as string} size={24} />
            <Text fontSize={20} fontWeight="bold" color="$blue10Light">
              {title || data?.title}
            </Text>
          </XStack>
        }
      />
      <YStack flex={1}>
        <XStack
          space
          alignItems="center"
          paddingBottom={16}
          paddingHorizontal={20}
        >
          <YStack space={4} alignItems="center" width="100%">
            <Text fontSize={12} color="$gray10Light" textAlign="center">
              {description || data?.description}
            </Text>
          </YStack>
        </XStack>
        <FlatList
          data={data?.entries || []}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          renderItem={({ item }) => {
            return <FeedItem item={item} />
          }}
          ItemSeparatorComponent={() => (
            <YStack bg="gray" h={StyleSheet.hairlineWidth} />
          )}
        />
      </YStack>
    </YStack>
  )
}
