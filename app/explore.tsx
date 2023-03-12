import { useNavigation } from 'expo-router'
import { Menu } from 'iconoir-react-native'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack, XStack, Input } from 'tamagui'

export default function Explore() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  return (
    <YStack pt={insets.top} flex={1}>
      <XStack space={8} flex={1} px={16} alignItems="center">
        <Pressable
          onPress={() => {
            // @ts-ignore
            navigation.openDrawer()
          }}
        >
          <Menu width={28} height={28} />
        </Pressable>
        <Input flex={1} borderRadius={20} height={40} />
      </XStack>
    </YStack>
  )
}
