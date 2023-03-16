import DrawerHeader from 'components/DrawerHeader'
import { useNavigation } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
import AddFeedButton from 'components/AddFeedButton'
import { FeedType } from 'types'

export default function Podcast() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  return (
    <YStack flex={1}>
      <DrawerHeader
        title="Podcasts"
        right={<AddFeedButton feedType={FeedType.Podcast} />}
      />
    </YStack>
  )
}
