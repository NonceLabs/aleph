import { Check, DoubleCheck, TextAlt, ViewGrid } from 'iconoir-react-native'
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
  Switch,
  Button,
} from 'tamagui'

export default function Shortcut() {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const hideRead = useAppSelector((state) => state.setting?.flow?.hideRead)
  const dispatch = useAppDispatch()

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <ViewGrid width={28} height={28} color="gray" />
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
        <Sheet.Frame f={1} p="$4" space="$3">
          <XStack space ai="center" jc="space-between">
            <Text fontWeight="bold" fontSize={18} color="$color11">
              Hide read
            </Text>
            <Switch
              size="$4"
              checked={hideRead}
              onCheckedChange={(checked) => {
                dispatch({
                  type: 'setting/updateHideRead',
                  payload: checked,
                })
              }}
            >
              <Switch.Thumb animation="bouncy" />
            </Switch>
          </XStack>

          <XStack space ai="center" jc="space-between">
            <Text fontWeight="bold" fontSize={18} color="$color11">
              Mark All as Read
            </Text>
            <Button size="$3" bc="#f0353c">
              <DoubleCheck width={16} height={16} color="white" />
              <Text color="white">Mark</Text>
            </Button>
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
