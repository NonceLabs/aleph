import { X } from '@tamagui/lucide-icons'
import { Plus } from 'iconoir-react-native'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { Unspaced, Dialog, Button, YStack, Input } from 'tamagui'
import { extract } from '../lib/parser'

export default function AddFeedButton() {
  const [url, setUrl] = useState('https://rsshub.app/wsj/en-us/opinion')

  useEffect(() => {
    extract('https://rsshub.app/wsj/en-us/opinion')
      .then((res) => {
        console.log('feed', res)
      })
      .catch(console.log)
  }, [])

  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Pressable hitSlop={15}>
          <Plus width={32} height={32} />
        </Pressable>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          o={0.7}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
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
          space
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
            />
            <Dialog.Close displayWhenAdapted asChild style={{ marginTop: 10 }}>
              <Button theme="alt1" aria-label="Close">
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
