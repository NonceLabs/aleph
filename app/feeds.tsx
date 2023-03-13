import AddFeedButton from 'components/AddFeedButton'
import SourceItem from 'components/SourceItem'
import { useNavigation } from 'expo-router'
import { Menu } from 'iconoir-react-native'
import { FlatList, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from 'store/hooks'
import { Text, XStack, YStack } from 'tamagui'

export default function Feeds() {
  const sources = useAppSelector((state) => state.feed.sources)
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

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
            <Menu width={24} height={24} />
          </Pressable>
          <Text fontFamily="Gilroy-Bold" fontSize={24}>
            Feeds
          </Text>
        </XStack>
        <AddFeedButton />
      </XStack>
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
