import { useNavigation } from 'expo-router'
import useFeeds from 'hooks/useFeeds'
import { InfoEmpty } from 'iconoir-react-native'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { Text, Sheet, YStack, H5, Anchor, Button } from 'tamagui'
import { FeedData, Source } from 'types'
import Favicon from './Favicon'

export default function FeedInfo({
  source,
  handleSubscribe,
}: {
  source?: Source | FeedData
  handleSubscribe: () => Promise<void>
}) {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)

  const navigation = useNavigation()
  const { feeds } = useFeeds()
  if (!source) {
    return null
  }

  const old = feeds.find((f) => f.url === source.url)
  const isSubscribed = !!old && !old.deleted
  const _handleSubscribe = async () => {
    await handleSubscribe()
    // @ts-ignore
    navigation.jumpTo('index')
  }
  return (
    <>
      <Pressable hitSlop={16} onPress={() => setOpen(true)}>
        <InfoEmpty width={24} height={24} color="gray" />
      </Pressable>
      <Sheet
        forceRemoveScrollEnabled={open}
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[50]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame f={1} p="$4" space="$7">
          <YStack space={8} ai="center">
            <Favicon favicon={source.favicon} size={60} />
            <H5 color="$color12">{source.title}</H5>
            {source.link && (
              <Anchor href={source.link} color="$blue10">
                {source.link}
              </Anchor>
            )}
            {source.description && (
              <Text
                color="$color10"
                textAlign="center"
                numberOfLines={4}
                ellipsizeMode="tail"
              >
                {source.description}
              </Text>
            )}
            <Button
              bc={isSubscribed ? '$color5' : '#f0353c'}
              size="$4"
              color={isSubscribed ? '$color11' : '$color1'}
              onPress={_handleSubscribe}
            >
              {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
