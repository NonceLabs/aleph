import { Menu } from '@tamagui/lucide-icons'
import { useNavigation } from 'expo-router'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Input, XStack } from 'tamagui'
import PlayerPortal from './PlayerPortal'

export default function EntryListHeader({
  keyword,
  setKeyword,
}: {
  keyword: string
  setKeyword: (keyword: string) => void
}) {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  return (
    <XStack space={8} flex={1} px={16} alignItems="center" pt={insets.top}>
      <Pressable
        onPress={() => {
          // @ts-ignore
          navigation.openDrawer()
        }}
      >
        <Menu width={28} height={28} color="#f0353c" />
      </Pressable>
      <Input
        flex={1}
        borderRadius={20}
        height={40}
        value={keyword}
        onChangeText={setKeyword}
        clearTextOnFocus
        onFocus={() => setKeyword('')}
        onEndEditing={() => {
          console.log('end editing', keyword)
        }}
      />
      <PlayerPortal />
      {/* <Shortcut /> */}
    </XStack>
  )
}
