import { Plus } from 'iconoir-react-native'
import { StyleSheet } from 'react-native'
import { YStack, Dialog } from 'tamagui'
import AddFeedButton from '../../components/AddFeedButton'
import Header from '../../components/Header'

export default function FeedPage() {
  return (
    <YStack>
      <Header title="Feeds" right={<AddFeedButton />} />
    </YStack>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
