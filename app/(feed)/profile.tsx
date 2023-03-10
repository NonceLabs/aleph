import Header from 'components/Header'
import { useSearchParams } from 'expo-router'
import { extract } from 'lib/parser'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Anchor, H3, Paragraph, YStack, H6, Text, Button } from 'tamagui'
import { FeedData } from 'types'
import dayjs from 'dayjs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function FeedProfile() {
  const [data, setData] = useState<FeedData>()
  const { url } = useSearchParams()
  const insets = useSafeAreaInsets()
  useEffect(() => {
    if (url) {
      console.log('url', url)

      extract(url as string)
        .then((res) => {
          setData(res)
          console.log('res', res)
        })
        .catch(console.log)
    }
  }, [url])

  console.log('data?.link', data?.link)

  return (
    <YStack>
      <Header
        title="Back"
        back
        right={
          <Button themeInverse size="$2">
            Follow
          </Button>
        }
      />
      <YStack alignItems="center">
        <YStack space alignItems="center" paddingBottom={16}>
          <H3>{data?.title}</H3>
          {data?.link && <Anchor href={data?.link}>{data?.link}</Anchor>}
          <Paragraph>{data?.description}</Paragraph>
        </YStack>
        <FlatList
          data={data?.entries || []}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          renderItem={({ item }) => {
            return (
              <YStack p={10}>
                <H6>{item.title}</H6>
                <Text fontSize={12} color="$gray10">
                  {dayjs(item.published).format('HH:mm, MMM DD')}
                </Text>
              </YStack>
            )
          }}
          ItemSeparatorComponent={() => (
            <YStack bg="gray" h={StyleSheet.hairlineWidth} />
          )}
        />
      </YStack>
    </YStack>
  )
}
