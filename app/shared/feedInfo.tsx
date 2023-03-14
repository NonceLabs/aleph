import Favicon from 'components/Favicon'
import Header from 'components/Header'
import { useNavigation, useSearchParams } from 'expo-router'
import useFeeds from 'hooks/useFeeds'
import { MAIN_COLOR } from 'lib/constants'
import { unsubFeed } from 'lib/db'
import { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Input, TextArea, XStack, YStack } from 'tamagui'
import { Feed } from 'types'

export default function FeedInfo() {
  const { url } = useSearchParams()
  const navigation = useNavigation()

  const [feed, setFeed] = useState<Feed>()
  const { feeds } = useFeeds()
  const _feed = feeds.find((t) => t.url === url)

  useEffect(() => {
    if (_feed) {
      setFeed(_feed)
    }
  }, [_feed])

  const onUnsub = () => {
    if (_feed) {
      unsubFeed(_feed)
      // @ts-ignore
      navigation.jumpTo('index')
    }
  }

  return (
    <YStack flex={1}>
      <Header title="Feed Info" back />
      {feed && (
        <YStack px={16} space={16}>
          <XStack jc="center">
            <Favicon favicon={feed.favicon} size={64} />
          </XStack>
          <Input
            value={feed.title}
            onChangeText={(text) => setFeed({ ...feed, title: text })}
          />
          <Input value={feed.url} disabled />
          <TextArea
            value={feed.description}
            onChangeText={(text) => setFeed({ ...feed, description: text })}
          />
          <XStack ai="center" jc="space-around" space={16}>
            <Button bc="$blue8Light" flex={1} color="white" onPress={onUnsub}>
              Unsubscribe
            </Button>
            <Button bc={MAIN_COLOR} flex={1} color="white" onPress={onUnsub}>
              Update
            </Button>
          </XStack>
        </YStack>
      )}
    </YStack>
  )
}
