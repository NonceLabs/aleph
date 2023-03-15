import AddFeedButton from 'components/AddFeedButton'
import DrawerHeader from 'components/DrawerHeader'
import SourceItem from 'components/SourceItem'
import useFeeds from 'hooks/useFeeds'
import { EmojiLookDown } from 'iconoir-react-native'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, YStack } from 'tamagui'

export default function Feeds() {
  const insets = useSafeAreaInsets()
  const { feeds } = useFeeds()

  return (
    <YStack flex={1}>
      <DrawerHeader title="Feeds" right={<AddFeedButton />} />
      <FlatList
        data={feeds.filter((t) => !t.deleted)}
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
        ItemSeparatorComponent={() => (
          <YStack height={1} backgroundColor="$borderColor" />
        )}
        renderItem={({ item }) => {
          return <SourceItem item={item} />
        }}
        ListEmptyComponent={
          <YStack flex={1} ai="center" jc="center" space pt={100}>
            <EmojiLookDown
              width={140}
              height={140}
              color="#999"
              strokeWidth={1}
            />
            <Text color="$color11" fontSize={18}>
              You don't have any feeds
            </Text>
          </YStack>
        }
      />
    </YStack>
  )
}
