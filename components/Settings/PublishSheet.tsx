import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { XStack, Text, Sheet, YStack, Select, Adapt } from 'tamagui'

export default function PublishSheet() {
  const publishLimit = useAppSelector((state) =>
    state.setting.flow.publishLimit.toLowerCase()
  )
  const dispatch = useAppDispatch()

  const onChange = (value: string) => {
    dispatch({
      type: 'setting/updatePublishLimit',
      payload: value,
    })
  }

  return (
    <XStack ai="center" jc="space-between">
      <Text color="$color11" fontFamily="Gilroy-Bold" fontSize={18}>
        Fetch feed since last
      </Text>
      <Select value={publishLimit} onValueChange={onChange}>
        <Select.Trigger w={100} iconAfter={ChevronDown}>
          <Select.Value
            placeholder={publishLimit}
            maxWidth={50}
            ellipsizeMode="tail"
          />
        </Select.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet modal dismissOnSnapToBottom snapPoints={[30]}>
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
                Fetch feed since last
              </Select.Label>
              {['Week', 'Month', 'Year', 'Ever'].map((item, i) => {
                return (
                  <Select.Item index={i} key={item} value={item.toLowerCase()}>
                    <Select.ItemText
                      color="$red10"
                      fontSize={16}
                      fontFamily="Arvo"
                    >
                      {item.toLowerCase()}
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
