import Header from 'components/Header'
import { useSearchParams } from 'expo-router'
import { extract } from 'lib/parser'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { YStack, Text, Button, XStack } from 'tamagui'
import { FeedData } from 'types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import EntryItem from 'components/EntryItem'
import Favicon from 'components/Favicon'
import _ from 'lodash'

export default function FeedProfile() {
  const [data, setData] = useState<FeedData>()
  const { url, title, description } = useSearchParams()
  const insets = useSafeAreaInsets()
  const flows = useAppSelector((state) => state.feed.flow)
  const source = flows.find((f) => f.url === url)

  useEffect(() => {
    if (source) {
      setData(source)
    } else if (url) {
      extract(url as string)
        .then((res) => {
          console.log('subscribe', _.omit(res, 'entries'))
          setData(res)
        })
        .catch((error) => {
          console.log('extract error', error)
        })
    }
  }, [url, source])

  const isSubscribed = !!source
  const dispatch = useAppDispatch()

  const handleSubscribe = () => {
    if (isSubscribed) {
      dispatch({
        type: 'feed/unsubscribe',
        payload: source,
      })
    } else {
      console.log('subscribe', _.omit(data, 'entries'))
    }
  }

  const desc = description || data?.description
  const favicon = source?.favicon || data?.favicon

  return (
    <YStack flex={1}>
      <Header
        title="Back"
        back
        center={
          <XStack space={4} alignItems="center">
            <Favicon favicon={favicon} size={24} />
            <Text
              fontSize={20}
              fontWeight="bold"
              color="$blue10Light"
              maxWidth={140}
              numberOfLines={1}
            >
              {title || data?.title}
            </Text>
          </XStack>
        }
        right={
          <Button
            bc={isSubscribed ? '$color11' : '#f0353c'}
            size="$2"
            color="$color1"
            onPress={handleSubscribe}
          >
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </Button>
        }
      />
      <YStack flex={1}>
        {desc && (
          <XStack
            space
            alignItems="center"
            paddingBottom={16}
            paddingHorizontal={20}
          >
            <YStack space={4} alignItems="center" width="100%">
              <Text fontSize={12} color="$gray10Light" textAlign="center">
                {desc}
              </Text>
            </YStack>
          </XStack>
        )}
        <FlatList
          data={data?.entries || []}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          renderItem={({ item }) => {
            return <EntryItem item={item} />
          }}
          ItemSeparatorComponent={() => (
            <YStack bg="gray" h={StyleSheet.hairlineWidth} />
          )}
        />
      </YStack>
    </YStack>
  )
}
