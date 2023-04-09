import { YStack, XStack, Text, Switch, Button, Separator } from 'tamagui'
import { DoubleCheck } from 'iconoir-react-native'
import { Pressable, ScrollView } from 'react-native'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import { markAllRead } from 'lib/db'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { HOST, MAIN_COLOR } from 'lib/constants'
import MyAPIKey from 'components/Settings/MyAPIKey'
import RoleSheet from 'components/Settings/RoleSheet'
import ModelSheet from 'components/Settings/ModelSheet'
import { useEffect } from 'react'
import { post } from 'lib/request'
import PublishSheet from 'components/Settings/PublishSheet'
import { Github } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as WebBrowser from 'expo-web-browser'

export default function SettingsPage() {
  const hideRead = useAppSelector((state) => state.setting?.flow?.hideRead)
  const { apiKey } = useAppSelector((state) => state.setting?.openAI)
  const insets = useSafeAreaInsets()

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
      <DrawerHeader title="Settings" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack space={16} px={16} mt={16}>
          <XStack space ai="center" jc="space-between">
            <Text fontFamily="Arvo" color="$color11">
              Hide read
            </Text>
            <Switch
              size="$3"
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
            <Text fontFamily="Arvo" color="$color11">
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

          <PublishSheet />

          <YStack space={16}>
            <ModelSheet />

            <RoleSheet />
          </YStack>
          <MyAPIKey />

          <YStack ai="center" space="$2" mt="$4">
            <Pressable>
              <Text fontFamily="Arvo" color="$color11">
                Made by @chezhe
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                WebBrowser.openBrowserAsync(
                  'https://github.com/NonceLabs/aleph'
                )
              }}
            >
              <XStack ai="center" jc="center" space="$2">
                <Text fontFamily="Arvo" color="$color11">
                  open source
                </Text>
                <Github size={16} color={MAIN_COLOR} />
              </XStack>
            </Pressable>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
