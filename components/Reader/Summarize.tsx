import { Flower } from 'iconoir-react-native'
import { HOST, MAIN_COLOR } from 'lib/constants'
import { post } from 'lib/request'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from 'store/hooks'
import {
  Text,
  Sheet,
  YStack,
  Spinner,
  ScrollView,
  XStack,
  Button,
  useWindowDimensions,
} from 'tamagui'
import { FeedEntry } from 'types'
import LottieView from 'lottie-react-native'

export default function Summarize({ entry }: { entry?: FeedEntry }) {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [summary, setSummary] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { width, height } = useWindowDimensions()

  const fontFamily = useAppSelector(
    (state) => state.setting?.reader?.fontFamily
  )
  const { apiKey, model, role } = useAppSelector(
    (state) => state.setting?.openAPI
  )

  if (!entry) {
    return null
  }

  const onOpenChange = (_open: boolean) => {
    setGenerating(true)
    setSummary('')
    setErrorMessage('')
    setOpen(_open)
    if (_open && entry) {
      post(`${HOST}/summarize`, {
        url: entry.id,
        apiKey,
        model,
        role,
      })
        .then((result) => {
          setGenerating(false)
          if (result.error) {
            setErrorMessage(result.error.message)
          } else {
            setSummary(result.content)
          }
        })
        .catch((error) => {
          setGenerating(false)
          setSummary(
            error instanceof Error
              ? error.message
              : 'Failed to summarize article. Please try again later. :('
          )
        })
    }
  }

  return (
    <>
      <Pressable onPress={() => onOpenChange(true)}>
        <Flower width={28} height={28} color={MAIN_COLOR} />
      </Pressable>
      <Sheet
        forceRemoveScrollEnabled={open}
        modal
        open={open}
        onOpenChange={onOpenChange}
        snapPoints={[90]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame f={1} p="$4">
          <ScrollView h={height * 0.8} p={8}>
            {summary && (
              <Text
                fontSize={20}
                color="$color12"
                ta="left"
                fontFamily={fontFamily}
              >
                {summary.trim()}
              </Text>
            )}
            {errorMessage && (
              <Text fontSize={16} color="$color11" ta="center">
                {errorMessage}
              </Text>
            )}
            {generating && (
              <YStack pt={20} space={8} ai="center">
                <LottieView
                  autoPlay
                  loop
                  style={{
                    width,
                    height: width,
                  }}
                  speed={1.4}
                  source={require(`../../assets/loading.json`)}
                />
              </YStack>
            )}
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
