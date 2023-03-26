import { YStack, XStack, Text, Switch, Button, Group, Separator } from 'tamagui'
import { DoubleCheck } from 'iconoir-react-native'
import { Pressable, ScrollView } from 'react-native'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import { markAllRead } from 'lib/db'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { HOST, MAIN_COLOR } from 'lib/constants'
import { ChevronRight } from '@tamagui/lucide-icons'
import MyAPIKey from 'components/Settings/MyAPIKey'
import RoleSheet from 'components/Settings/RoleSheet'
import ModelSheet from 'components/Settings/ModelSheet'
import { useEffect } from 'react'
import { fetcher, post } from 'lib/request'

export default function SettingsPage() {
  const hideRead = useAppSelector((state) => state.setting?.flow?.hideRead)
  const publishLimit = useAppSelector(
    (state) => state.setting?.flow?.publishLimit || 'Month'
  )
  const { apiKey, model, role } = useAppSelector(
    (state) => state.setting?.openAPI
  )

  useEffect(() => {
    post(`${HOST}/models`, { apiKey })
      .then((result) => {
        dispatch({
          type: 'setting/updateModels',
          payload: result,
        })
      })
      .catch(console.log)
  }, [apiKey])

  const dispatch = useAppDispatch()
  return (
    <YStack flex={1}>
      <ScrollView
        style={{ flex: 1, paddingVertical: 10 }}
        stickyHeaderIndices={[0]}
      >
        <DrawerHeader title="Settings" />
        <YStack space={16} px={16} mt={16}>
          <XStack ai="center" space>
            <Separator borderColor="$color11" />
            <Text color="$color11" fontFamily="Gilroy-Bold">
              Common Settings
            </Text>
            <Separator borderColor="$color11" />
          </XStack>
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
          <YStack space={4}>
            <Text fontWeight="bold" fontSize={18} color="$color11">
              Only fetch articles since last
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

          <XStack ai="center" space>
            <Separator borderColor="$color11" />
            <Text color="$color11" fontFamily="Gilroy-Bold">
              Use My Own API Key
            </Text>
            <Separator borderColor="$color11" />
          </XStack>

          {!apiKey && (
            <XStack>
              <Text color="$color10" fontSize={12} fontFamily="Arvo">
                With your own API key, you can customize model and role, also
                you can give feedback to AI which will make AI know you better,
                and learn your preference.
              </Text>
            </XStack>
          )}

          <ModelSheet />

          <RoleSheet />

          <MyAPIKey />
        </YStack>
      </ScrollView>
    </YStack>
  )
}
