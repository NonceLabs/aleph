import AddFeedButton from 'components/AddFeedButton'
import SourceItem from 'components/SourceItem'
import { useNavigation } from 'expo-router'
import useFeeds from 'hooks/useFeeds'
import { EmojiLookDown, Menu } from 'iconoir-react-native'
import { FlatList, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, XStack, YStack } from 'tamagui'

export default function Feeds() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const { feeds } = useFeeds()

  return (
    <YStack flex={1}>
      <XStack pt={insets.top} px={16} ai="center" jc="space-between">
        <XStack ai="center" space={8}>
          <Pressable
            onPress={() => {
              // @ts-ignore
              navigation.openDrawer()
            }}
          >
            <Menu width={24} height={24} color="#f0353c" />
          </Pressable>
          <Text fontFamily="Gilroy-Bold" fontSize={24} color="$color12">
            Feeds
          </Text>
        </XStack>
        <AddFeedButton />
      </XStack>
      <FlatList
        data={feeds}
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
