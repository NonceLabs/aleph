import { Flower } from 'iconoir-react-native'
import { HOST, MAIN_COLOR } from 'lib/constants'
import { post } from 'lib/request'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { useAppSelector } from 'store/hooks'
import { Text, Sheet, YStack, Spinner, ScrollView } from 'tamagui'
import { FeedEntry } from 'types'

export default function Summarize({ entry }: { entry?: FeedEntry }) {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [summary, setSummary] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const fontFamily = useAppSelector(
    (state) => state.setting?.reader?.fontFamily
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
        snapPoints={[81]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame f={1} p="$4">
          <ScrollView f={1} p={8}>
            {summary && (
              <Text
                fontSize={18}
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
                <Spinner size="large" />
                <Text fontSize={16} color="$color11">
                  Generatinng summary
                </Text>
              </YStack>
            )}
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
