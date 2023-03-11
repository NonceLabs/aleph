import { FlashList } from '@shopify/flash-list'
import { Link } from 'expo-router'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from 'store/hooks'
import { Heading, ScrollView, Text, YStack } from 'tamagui'
import SourceItem from './SourceItem'

export default function DrawerPanel() {
  const insets = useSafeAreaInsets()
  const sources = useAppSelector((state) => state.feed.sources)
  console.log('sources', sources)

  return (
    <YStack
      flex={1}
      pt={insets.top}
      pb={insets.bottom}
      space
      px={8}
      justifyContent="space-between"
    >
      {/* <ScrollView>
        {sources.map((source) => {
          return <SourceItem key={source.url} item={source} />
        })}
      </ScrollView> */}
      <FlatList
        data={sources}
        style={{
          flex: 1,
          maxHeight: 300,
          minHeight: 100,
        }}
        ItemSeparatorComponent={() => (
          <YStack height={1} backgroundColor="$borderColor" />
        )}
        renderItem={({ item }) => {
          return <SourceItem item={item} />
        }}
      />
      <YStack width="100%" space={8}>
        <Link href="/">
          <Text
            textAlign="right"
            fontWeight="bold"
            fontSize={24}
            fontFamily="Gilroy-Bold"
            width={200}
          >
            Home
          </Text>
        </Link>
        <Link href="/settings">
          <Text
            textAlign="right"
            fontWeight="bold"
            fontSize={24}
            fontFamily="Gilroy-Bold"
          >
            Settings
          </Text>
        </Link>
      </YStack>
    </YStack>
  )
}
