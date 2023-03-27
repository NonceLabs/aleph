import {
  Check,
  ChevronDown,
  ChevronUp,
  VenetianMask,
} from '@tamagui/lucide-icons'
import Toast from 'lib/toast'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { XStack, Text, Sheet, YStack, Select, Adapt } from 'tamagui'

export default function ModelSheet() {
  const {
    apiKey,
    model: _model,
    models,
  } = useAppSelector((state) => state.setting.openAPI)
  const [model, setModel] = useState(_model)
  const dispatch = useAppDispatch()

  const onChangeModel = (value: string) => {
    if (!apiKey) {
      return Toast.error("You don't have an API key yet")
    }
    setModel(value)
    dispatch({
      type: 'setting/updateModel',
      payload: value,
    })
  }

  return (
    <XStack ai="center" space={8}>
      <VenetianMask size={20} color="$color11" />
      <Text color="$color11" fontFamily="Arvo" fontSize={14}>
        Customize model
      </Text>
      <Select id="food" value={model} onValueChange={onChangeModel} size="$3">
        <Select.Trigger w={200} iconAfter={ChevronDown}>
          <Select.Value
            placeholder={model}
            maxWidth={50}
            ellipsizeMode="tail"
          />
        </Select.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet modal dismissOnSnapToBottom snapPoints={[50]}>
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
              <Select.Label fontFamily="Gilroy-Bold">
                Customize model
              </Select.Label>
              {models.map((item, i) => {
                return (
                  <Select.Item index={i} key={item} value={item.toLowerCase()}>
                    <Select.ItemText
                      color="$red10"
                      fontSize={16}
                      fontFamily="Arvo"
                    >
                      {item}
                    </Select.ItemText>
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
