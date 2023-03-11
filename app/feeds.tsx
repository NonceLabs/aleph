import AddFeedButton from 'components/AddFeedButton'
import SourceItem from 'components/SourceItem'
import { FlatList } from 'react-native'
import { useAppSelector } from 'store/hooks'
import { XStack, YStack } from 'tamagui'

export default function Feeds() {
  const sources = useAppSelector((state) => state.feed.sources)

  return (
    <YStack flex={1}>
      <FlatList
        data={sources}
        style={{
          flex: 1,
        }}
        contentContainerStyle={{ padding: 20 }}
        ItemSeparatorComponent={() => (
          <YStack height={1} backgroundColor="$borderColor" />
        )}
        renderItem={({ item }) => {
          return <SourceItem item={item} />
        }}
      />
    </YStack>
  )
}
