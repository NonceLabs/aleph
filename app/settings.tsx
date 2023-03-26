import { YStack, XStack, Text, Switch, Button, Group, Separator } from 'tamagui'
import { DoubleCheck } from 'iconoir-react-native'
import { Pressable, ScrollView } from 'react-native'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import { markAllRead } from 'lib/db'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { MAIN_COLOR } from 'lib/constants'
import { ChevronRight } from '@tamagui/lucide-icons'

export default function SettingsPage() {
  const hideRead = useAppSelector((state) => state.setting?.flow?.hideRead)
  const publishLimit = useAppSelector(
    (state) => state.setting?.flow?.publishLimit || 'Month'
  )
  const { apiKey, model, role } = useAppSelector(
    (state) => state.setting?.openAPI
  )

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
          <YStack space>
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

          <XStack space ai="center" jc="space-between">
            <Text color="$color11" fontFamily="Gilroy-Bold" fontSize={18}>
              Model
            </Text>
            <Pressable>
              <XStack ai="center">
                <Text color={MAIN_COLOR} fontSize={16} fontFamily="Arvo">
                  {model || 'gpt-4'}
                </Text>
                <ChevronRight size={16} color="$color9" />
              </XStack>
            </Pressable>
          </XStack>

          <XStack space ai="center" jc="space-between">
            <Text color="$color11" fontFamily="Gilroy-Bold" fontSize={18}>
              Role
            </Text>
            <Pressable>
              <XStack ai="center">
                <Text color={MAIN_COLOR} fontSize={16} fontFamily="Arvo">
                  {role || 'assistant'}
                </Text>
                <ChevronRight size={16} color="$color9" />
              </XStack>
            </Pressable>
          </XStack>

          <Button bc={MAIN_COLOR} color="white">
            Enter API Key
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
