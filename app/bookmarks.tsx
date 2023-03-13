import EntryList from 'components/EntryList'
import { useNavigation } from 'expo-router'
import { Menu } from 'iconoir-react-native'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from 'store/hooks'
import { Heading, XStack, YStack, Text } from 'tamagui'

export default function Bookmarks() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const entries = useAppSelector((state) => state.feed.bookmarked)

  return (
    <YStack flex={1}>
      <XStack pt={insets.top} px={16} space={8} ai="center">
        <Pressable
          onPress={() => {
            // @ts-ignore
            navigation.openDrawer()
          }}
        >
          <Menu width={24} height={24} color="#f0353c" />
        </Pressable>
        <Text fontFamily="Gilroy-Bold" fontSize={24} color="$color12">
          Bookmarks
        </Text>
      </XStack>
      <EntryList entries={entries} type="bookmarks" withHeader={false} />
    </YStack>
  )
}
