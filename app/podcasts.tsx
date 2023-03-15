import DrawerHeader from 'components/DrawerHeader'
import { useNavigation } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack, XStack, Input } from 'tamagui'
import AddFeedButton from 'components/AddFeedButton'

export default function Podcast() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  return (
    <YStack flex={1}>
      <DrawerHeader title="Podcasts" right={<AddFeedButton />} />
    </YStack>
  )
}
