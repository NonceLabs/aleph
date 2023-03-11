import { X, PlusCircle } from '@tamagui/lucide-icons'
import { Plus } from 'iconoir-react-native'
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

export default function AddFeedButton() {
  const [url, setUrl] = useState('https://cn.nytimes.com/rss/')

  const router = useRouter()
  const { width } = useWindowDimensions()

  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Pressable hitSlop={15}>
          <PlusCircle size={24} />
        </Pressable>
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
            />
            <Dialog.Close asChild>
              <Button
                themeInverse
                style={{ marginTop: 16 }}
                onPress={() => {
                  router.push({
                    pathname: '(feed)/profile',
                    params: { url: encodeURIComponent(url) },
                  })
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
