import { DoubleCheck, ViewGrid } from 'iconoir-react-native'
import { MAIN_COLOR } from 'lib/constants'
import { markAllRead } from 'lib/db'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { XStack, Text, Sheet, Switch, Button, Group } from 'tamagui'

export default function Shortcut() {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const hideRead = useAppSelector((state) => state.setting?.flow?.hideRead)
  const publishLimit = useAppSelector(
    (state) => state.setting?.flow?.publishLimit || 'Month'
  )
  const dispatch = useAppDispatch()

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <ViewGrid width={32} height={32} color="#f0353c" />
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
              bc={hideRead ? '$blue8' : '$color8'}
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
            <Button
              size="$3"
              bc="#f0353c"
              onPress={() => {
                dispatch({
                  type: 'feed/markAllAsRead',
                })
                markAllRead()
              }}
            >
              <DoubleCheck width={16} height={16} color="white" />
              <Text color="white">Mark</Text>
            </Button>
          </XStack>

          <XStack space ai="center" jc="space-between">
            <Text fontWeight="bold" fontSize={18} color="$color11">
              Articles in last
            </Text>
            <Group axis="horizontal">
              {['Week', 'Month', 'Year'].map((t) => {
                const isActive = publishLimit === t
                return (
                  <Group.Item key={t}>
                    <Button
                      size="$3"
                      bc={isActive ? MAIN_COLOR : '$color8'}
                      color={isActive ? 'white' : '$color12'}
                      onPress={() => {
                        dispatch({
                          type: 'setting/updatePublishLimit',
                          payload: t,
                        })
                      }}
                    >
                      {t}
                    </Button>
                  </Group.Item>
                )
              })}
            </Group>
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
