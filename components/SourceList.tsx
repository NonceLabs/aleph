import { FlatList, Pressable } from 'react-native'
import { useAppSelector } from 'store/hooks'
import { Text, XStack, YStack } from 'tamagui'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import SourceItem from './SourceItem'

export default function SourceList() {
  const sources = useAppSelector((state) => state.feed.sources)

  return (
    <YStack flex={1}>
      <FlatList
        data={sources}
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
