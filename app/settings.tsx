import { YStack, XStack, Text, Switch, Button, Group, Separator } from 'tamagui'
import { DoubleCheck } from 'iconoir-react-native'
import { ScrollView } from 'react-native'
import DrawerHeader from 'components/DrawerHeader'
import { markAllRead, purgeAllData } from 'lib/db'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { MAIN_COLOR } from 'lib/constants'

export default function SettingsPage() {
  const hideRead = useAppSelector((state) => state.setting?.flow?.hideRead)
  const publishLimit = useAppSelector(
    (state) => state.setting?.flow?.publishLimit || 'Month'
  )
  const dispatch = useAppDispatch()
  return (
    <YStack flex={1}>
      <DrawerHeader title="Settings" />

      <ScrollView
        style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 16 }}
      >
        <YStack space={16}>
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

          <Separator />

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

          <Separator />
          <YStack space>
            <Text fontWeight="bold" fontSize={18} color="$color11">
              Articles in last
            </Text>
            <Group axis="horizontal" bc="$backgroundTransparent" width="100%">
              {['Week', 'Month', 'Year', 'Ever'].map((t) => {
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
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
