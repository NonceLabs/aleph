import Favicon from 'components/Favicon'
import Header from 'components/Header'
import { useNavigation, useSearchParams } from 'expo-router'
import useFeeds from 'hooks/useFeeds'
import { MAIN_COLOR } from 'lib/constants'
import { unsubFeed } from 'lib/db'
import { useEffect, useState } from 'react'
import { Button, Input, Text, TextArea, XStack, YStack } from 'tamagui'
import { Feed } from 'types'

export default function FeedInfo() {
  const { url } = useSearchParams()
  const navigation = useNavigation()

  const [feed, setFeed] = useState<Feed>()
  const { feeds, onUpdateFeed } = useFeeds()
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

  const onUpdate = () => {
    if (_feed && feed) {
      onUpdateFeed(feed)
      navigation.goBack()
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
          <YStack space={4}>
            <Text color="$color11">Title</Text>
            <Input
              value={feed.title}
              onChangeText={(text) => setFeed({ ...feed, title: text })}
            />
          </YStack>

          <YStack space={4}>
            <Text color="$color11">Source</Text>
            <Input value={feed.url} disabled o={0.5} />
          </YStack>

          <YStack space={4}>
            <Text color="$color11">Favicon</Text>
            <Input
              value={feed.favicon}
              onChangeText={(text) => setFeed({ ...feed, favicon: text })}
            />
          </YStack>

          <YStack space={4}>
            <Text color="$color11">Description</Text>

            <TextArea
              value={feed.description}
              onChangeText={(text) => setFeed({ ...feed, description: text })}
            />
          </YStack>
          <XStack ai="center" jc="space-around" space={16}>
            <Button bc="$blue8Light" flex={1} color="white" onPress={onUnsub}>
              Unsubscribe
            </Button>
            <Button bc={MAIN_COLOR} flex={1} color="white" onPress={onUpdate}>
              Update
            </Button>
          </XStack>
        </YStack>
      )}
    </YStack>
  )
}
