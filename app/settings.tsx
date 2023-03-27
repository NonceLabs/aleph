import {
  YStack,
  XStack,
  Text,
  Switch,
  Button,
  Group,
  Separator,
  Progress,
} from 'tamagui'
import { DoubleCheck } from 'iconoir-react-native'
import { ScrollView } from 'react-native'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import { markAllRead } from 'lib/db'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { HOST, MAIN_COLOR, SUMMARIZE_LIMIT } from 'lib/constants'
import MyAPIKey from 'components/Settings/MyAPIKey'
import RoleSheet from 'components/Settings/RoleSheet'
import ModelSheet from 'components/Settings/ModelSheet'
import { useEffect, useState } from 'react'
import { post } from 'lib/request'
import PublishSheet from 'components/Settings/PublishSheet'
import { Infinity, Languages, Podcast, ThumbsUp } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SettingsPage() {
  const hideRead = useAppSelector((state) => state.setting?.flow?.hideRead)
  const { apiKey } = useAppSelector((state) => state.setting?.openAPI)
  const { count, resetAt } = useAppSelector((state) => state.setting.summarize)
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
      >
        <YStack space={16} px={16} mt={16}>
          <XStack ai="center" space my={16}>
            <Separator borderColor="$color11" />
            <Text color="$color11" fontFamily="Gilroy-Bold">
              Common Settings
            </Text>
            <Separator borderColor="$color11" />
          </XStack>
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

          {!apiKey && [
            <Separator key="sep" />,
            <YStack space={4} key="summary-limit">
              <Text fontFamily="Arvo" color="$color11">
                Summary Limit
              </Text>

              <YStack space={4}>
                <Text color="$color11" fontFamily="Arvo" ta="right">
                  {count}/{SUMMARIZE_LIMIT}
                </Text>
                <Progress size="$3" value={(count || 0) * 10}>
                  <Progress.Indicator animation="bouncy" />
                </Progress>
              </YStack>
            </YStack>,
          ]}

          <XStack ai="center" space mt={16}>
            <Separator borderColor={MAIN_COLOR} />
            <Text color={MAIN_COLOR} fontFamily="Gilroy-Bold" fontSize={18}>
              Aleph Pro
            </Text>
            <Separator borderColor={MAIN_COLOR} />
          </XStack>

          {!apiKey && (
            <XStack>
              <Text color="$color10" fontSize={14} fontFamily="Arvo">
                After upgrade, you can use your own API key, unlock more
                features.
              </Text>
            </XStack>
          )}

          <MyAPIKey />

          <YStack space={16}>
            <ModelSheet />

            <RoleSheet />

            <XStack ai="center" space={8} my={5}>
              <Infinity size={20} color="$color11" />
              <Text color="$color11" fontSize={14} fontFamily="Arvo">
                Unlimited summary
              </Text>
            </XStack>

            <XStack ai="center" space={8} my={5}>
              <ThumbsUp size={20} color="$color11" />
              <Text color="$color11" fontSize={14} fontFamily="Arvo">
                Let AI know your preference
              </Text>
            </XStack>

            <XStack ai="center" space={8} my={5}>
              <Languages size={20} color="$color11" />
              <Text color="$color11" fontSize={14} fontFamily="Arvo">
                Translation (coming soon)
              </Text>
            </XStack>

            <XStack ai="center" space={8} my={5}>
              <Podcast size={20} color="$color11" />
              <Text color="$color11" fontSize={14} fontFamily="Arvo">
                Transcript for podcast (coming soon)
              </Text>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
