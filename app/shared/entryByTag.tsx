import { ChevronLeft } from '@tamagui/lucide-icons'
import SimpleEntryList from 'components/Entry/SimpleEntryList'
import { useNavigation, useRouter, useSearchParams } from 'expo-router'
import useEntryFlow from 'hooks/useEntryFlow'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { XStack, YStack, Text, Input } from 'tamagui'

export default function EntryByTag() {
  const [tag, setTag] = useState('')
  const { tag: _tag, from } = useSearchParams()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { entries: _entries } = useEntryFlow()
  const entries = _entries.filter((t) => t.tags?.includes(tag))
  const navigation = useNavigation()

  useEffect(() => {
    if (typeof _tag === 'string') {
      setTag(_tag)
    }
  }, [_tag])

  const onBack = () => {
    if (from) {
      // @ts-ignore
      navigation.jumpTo(from)
    } else {
      router.back()
    }
  }

  return (
    <YStack flex={1}>
      <XStack paddingTop={insets.top} space={4} ai="center" pr={16}>
        <Pressable onPress={onBack}>
          <XStack alignItems="center">
            <ChevronLeft width={32} height={32} color="$blue10" />
          </XStack>
        </Pressable>
        <XStack ai="center" flex={1}>
          <Input flex={1} value={`#${tag as string}`} fontSize="$5" disabled />
        </XStack>
      </XStack>
      <XStack ai="center" jc="center" space={4} py={8} o={0.7}>
        <Text fontWeight="600" color="$blue11">
          {entries.length}
        </Text>
        <Text color="$color11">
          article{entries.length > 1 ? 's' : ''} found
        </Text>
      </XStack>
      <SimpleEntryList entries={entries} type="tags" onRefresh={() => {}} />
    </YStack>
  )
}
