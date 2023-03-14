import DrawerHeader from 'components/DrawerHeader'
import { useNavigation } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack, XStack, Input } from 'tamagui'

export default function Explore() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  return (
    <YStack pt={insets.top} flex={1}>
      <DrawerHeader title="Explore" />
    </YStack>
  )
}
