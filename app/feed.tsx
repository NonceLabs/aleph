import Header from 'components/Header'
import { useSearchParams } from 'expo-router'
import { extract } from 'lib/parser'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { YStack, Text, XStack } from 'tamagui'
import { FeedData } from 'types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from 'store/hooks'
import Favicon from 'components/Favicon'
import _ from 'lodash'
import FeedInfo from 'components/FeedInfo'
import { EmojiLookUp } from 'iconoir-react-native'
import AddFeedButton from 'components/AddFeedButton'
import EntryList from 'components/EntryList'

export default function FeedProfile() {
  const [data, setData] = useState<FeedData>()
  const [error, setError] = useState()
  const { url, title, description } = useSearchParams()
  const insets = useSafeAreaInsets()
  const flows = useAppSelector((state) => state.feed.flow)
  const source = flows.find((f) => f.url === url)

  useEffect(() => {
    setData(undefined)
    setError(undefined)
    if (source) {
      setData(source)
    } else if (url) {
      extract(url as string)
        .then((res) => {
          if (res) {
            setData({ ...res, url })
          }
        })
        .catch((error) => {
          setError(error)
        })
    }
  }, [url, source])

  const desc = description || data?.description
  const favicon = source?.favicon || data?.favicon

  return (
    <YStack flex={1}>
      <Header
        title=""
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
        right={<FeedInfo source={data} />}
      />
      <YStack flex={1}>
        {error && (
          <YStack space={8} ai="center" jc="center" pt={100}>
            <EmojiLookUp
              width={140}
              height={140}
              color="gray"
              strokeWidth={1}
            />
            <Text fontSize={16} color="$gray10">
              Something went wrong with this feed.
            </Text>
            <Text fontSize={16} color="$gray10">
              Please check the URL, and
            </Text>
            <AddFeedButton
              trigger={
                <Pressable>
                  <Text fontSize={16} color="$blue10">
                    add it again
                  </Text>
                </Pressable>
              }
            />
          </YStack>
        )}
        <EntryList
          entries={data?.entries || []}
          type="tags"
          withHeader={false}
        />
      </YStack>
    </YStack>
  )
}
