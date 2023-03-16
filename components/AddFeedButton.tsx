import { PlusCircle, X } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Pressable } from 'react-native'
import {
  Unspaced,
  Dialog,
  Button,
  YStack,
  Input,
  useWindowDimensions,
} from 'tamagui'
import { useRouter } from 'expo-router'
import { MAIN_COLOR } from 'lib/constants'
import { FeedType } from 'types'

export default function AddFeedButton({
  feedType = FeedType.RSS,
  trigger,
}: {
  feedType?: FeedType
  trigger?: React.ReactNode
}) {
  const [url, setUrl] = useState('')

  const router = useRouter()
  const { width } = useWindowDimensions()

  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        {trigger || (
          <Pressable hitSlop={15} style={{ marginRight: 10 }}>
            <PlusCircle width={28} height={28} color={MAIN_COLOR} />
          </Pressable>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          o={0.7}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
          backgroundColor="black"
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          space="$1"
          w={width - 40}
        >
          <YStack space={5}>
            <Dialog.Title size="$5" lineHeight="$1">
              Add Feed
            </Dialog.Title>
            <Dialog.Description size="$2">
              Paste URL of RSS below.
            </Dialog.Description>
            <Input
              size="$4"
              borderWidth={2}
              placeholder=""
              value={url}
              onChangeText={setUrl}
              textContentType="URL"
            />
            <Dialog.Close asChild>
              <Button
                bc={MAIN_COLOR}
                color="white"
                style={{ marginTop: 16 }}
                onPress={() => {
                  router.push({
                    pathname: 'shared/feed',
                    params: { url: encodeURIComponent(url), feedType },
                  })
                  setUrl('')
                }}
              >
                Confirm
              </Button>
            </Dialog.Close>
          </YStack>
          <Unspaced>
            <Dialog.Close asChild>
              <Button
                pos="absolute"
                t="$3"
                r="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
