import { Check, TextAlt } from 'iconoir-react-native'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  XStack,
  Text,
  Sheet,
  YStack,
  Slider,
  Circle,
  ScrollView,
} from 'tamagui'

export default function ReaderSettings() {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const fontSize = useAppSelector((state) => state.setting?.reader?.fontSize)
  const fontFamily = useAppSelector(
    (state) => state.setting?.reader?.fontFamily
  )
  const theme = useAppSelector(
    (state) => state.setting?.reader?.theme || 'light'
  )
  const dispatch = useAppDispatch()

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <TextAlt width={24} height={24} color="gray" />
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
          <YStack space>
            <Text fontWeight="bold" fontSize={18} color="$color11">
              Text Size
            </Text>
            <Slider
              defaultValue={[fontSize]}
              max={30}
              min={12}
              step={1}
              orientation="horizontal"
              onValueChange={(value) => {
                if (value.length) {
                  dispatch({
                    type: 'setting/updateFontSize',
                    payload: value[0],
                  })
                }
              }}
            >
              <Slider.Track backgroundColor="$gray7Light">
                <Slider.TrackActive backgroundColor="$blue7Light" />
              </Slider.Track>
              <Slider.Thumb index={0} circular elevate />
            </Slider>
          </YStack>

          <YStack space={4}>
            <Text fontWeight="bold" fontSize={18} color="$color11">
              Theme
            </Text>
            <XStack space>
              <Pressable
                onPress={() => {
                  dispatch({
                    type: 'setting/updateReaderTheme',
                    payload: 'light',
                  })
                }}
              >
                <Circle bc="white" size={40} borderWidth={2}>
                  {theme === 'light' && (
                    <Check
                      width={24}
                      height={24}
                      strokeWidth={2}
                      color="black"
                    />
                  )}
                </Circle>
              </Pressable>
              <Pressable
                onPress={() => {
                  dispatch({
                    type: 'setting/updateReaderTheme',
                    payload: 'dark',
                  })
                }}
              >
                <Circle bc="black" size={40} borderWidth={2}>
                  {theme === 'dark' && (
                    <Check
                      width={24}
                      height={24}
                      strokeWidth={2}
                      color="white"
                    />
                  )}
                </Circle>
              </Pressable>
            </XStack>
          </YStack>

          <YStack space>
            <Text fontWeight="bold" fontSize={18} color="$color11">
              Font
            </Text>
            <ScrollView
              horizontal
              space={16}
              showsHorizontalScrollIndicator={false}
            >
              {['Vollkorn', 'Inter', 'Gilroy', 'SpaceMono', 'Arvo'].map((t) => {
                return (
                  <Pressable
                    key={t}
                    onPress={() => {
                      dispatch({
                        type: 'setting/updateFontFamily',
                        payload: t,
                      })
                    }}
                  >
                    <XStack
                      borderWidth={2}
                      h={46}
                      px={8}
                      br={4}
                      ai="center"
                      jc="center"
                      borderColor={
                        t === fontFamily ? '$blue7Light' : '$gray7Light'
                      }
                    >
                      <Text fontSize={20} fontFamily={t} color="$color12">
                        {t}
                      </Text>
                    </XStack>
                  </Pressable>
                )
              })}
            </ScrollView>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
