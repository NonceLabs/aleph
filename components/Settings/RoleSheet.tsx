import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { ROLES } from 'lib/constants'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { XStack, Text, Sheet, YStack, Select, Adapt } from 'tamagui'

export default function RoleSheet() {
  const _role = useAppSelector((state) => state.setting.openAPI.role)
  const [role, setRole] = useState(_role)
  const dispatch = useAppDispatch()

  const onChangeRole = (value: string) => {
    setRole(value)
    dispatch({
      type: 'setting/updateRole',
      payload: value,
    })
  }

  return (
    <XStack ai="center" jc="space-between">
      <Text color="$color11" fontFamily="Gilroy-Bold" fontSize={18}>
        Role
      </Text>
      <Select id="food" value={role} onValueChange={onChangeRole}>
        <Select.Trigger w={180} iconAfter={ChevronDown}>
          <Select.Value placeholder="Something" />
        </Select.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet modal dismissOnSnapToBottom snapPoints={[25]}>
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            ai="center"
            jc="center"
            pos="relative"
            w="100%"
            h="$3"
          >
            <YStack zi={10}>
              <ChevronUp size={20} />
            </YStack>
          </Select.ScrollUpButton>

          <Select.Viewport minWidth={200}>
            <Select.Group space="$0">
              <Select.Label fontFamily="Gilroy-Bold">Role</Select.Label>
              {ROLES.map((item, i) => {
                return (
                  <Select.Item index={i} key={item} value={item.toLowerCase()}>
                    <Select.ItemText>{item}</Select.ItemText>
                    <Select.ItemIndicator ml="auto">
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                )
              })}
            </Select.Group>
          </Select.Viewport>

          <Select.ScrollDownButton
            ai="center"
            jc="center"
            pos="relative"
            w="100%"
            h="$3"
          >
            <YStack zi={10}>
              <ChevronDown size={20} />
            </YStack>
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    </XStack>
  )
}
