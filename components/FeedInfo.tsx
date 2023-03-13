import { useRouter } from 'expo-router'
import { Check, InfoEmpty, TextAlt } from 'iconoir-react-native'
import { HOST } from 'lib/constants'
import { post } from 'lib/request'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { Text, Sheet, YStack, H5, Anchor, Button } from 'tamagui'
import { FeedData, Source } from 'types'
import Favicon from './Favicon'

export default function FeedInfo({ source }: { source?: Source | FeedData }) {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()

  const router = useRouter()
  const sources = useAppSelector((state) => state.feed.sources)
  if (!source) {
    return null
  }

  const _source = sources.find((f) => f.url === source.url)
  const isSubscribed = !!_source
  const handleSubscribe = () => {
    try {
      if (_source) {
        dispatch({
          type: 'feed/unsubscribe',
          payload: source,
        })
      } else {
        const feed = {
          url: source.url,
          title: source.title,
          favicon: source.favicon,
          link: source.link,
          description: source.description,
        }
        dispatch({
          type: 'feed/subscribe',
          payload: feed,
        })
        post(`${HOST}/addFeed`, feed)
        router.replace('index')
      }
    } catch (error) {}
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
              <Text color="$color10">{source.description}</Text>
            )}
            <Button
              bc={isSubscribed ? '$color5' : '#f0353c'}
              size="$4"
              color={isSubscribed ? '$color11' : '$color1'}
              onPress={handleSubscribe}
            >
              {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
