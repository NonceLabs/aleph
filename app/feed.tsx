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
      <Header title="Back" back />
      <YStack flex={1}>
        <XStack
          space
          alignItems="center"
          paddingBottom={16}
          paddingHorizontal={20}
        >
          {logo && (
            <Image
              source={logo}
              style={{ width: 92, height: 92, borderRadius: 8 }}
            />
          )}
          <YStack space={4}>
            <Text fontSize={16}>{title || data?.title}</Text>
            <Text
              fontSize={12}
              color="$gray10Light"
              numberOfLines={1}
              ellipse
              ellipsizeMode="tail"
              w={240}
            >
              {description || data?.description}
            </Text>
            {(link || data?.link) && (
              <Anchor
                href={(link as string) || data?.link}
                fontSize={12}
                lineHeight={14}
              >
                {link || data?.link}
              </Anchor>
            )}

            <XStack>
              <Button
                themeInverse={!isFollowed}
                theme={isFollowed ? 'gray' : undefined}
                size="$2"
                paddingHorizontal={16}
                marginTop={4}
              >
                {isFollowed ? 'Unfollow' : 'Follow'}
              </Button>
            </XStack>
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
