import Header from 'components/Header'
import { Pressable, StyleSheet } from 'react-native'
import { YStack, YGroup, Separator, ListItem, XStack, Text } from 'tamagui'
import { ChevronRight } from '@tamagui/lucide-icons'
import { Crown, Menu, RssFeed, TextAlt } from 'iconoir-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from 'expo-router'
import { ScrollView } from 'react-native'

export default function SettingsPage() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  return (
    <YStack flex={1}>
      <XStack pt={insets.top} px={16} space={8} ai="center">
        <Pressable
          onPress={() => {
            // @ts-ignore
            navigation.openDrawer()
          }}
        >
          <Menu width={24} height={24} />
        </Pressable>
        <Text fontFamily="Gilroy-Bold" fontSize={24}>
          Settings
        </Text>
      </XStack>
      <ScrollView
        style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 16 }}
      >
        <YGroup als="center" bordered size="$5" separator={<Separator />}>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              title="Feeds"
              icon={<RssFeed width={24} height={24} />}
              iconAfter={ChevronRight}
            />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              title="Reader"
              icon={<TextAlt width={24} height={24} />}
              iconAfter={ChevronRight}
            />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              title="Pro"
              icon={<Crown width={24} height={24} />}
              iconAfter={ChevronRight}
            />
          </YGroup.Item>
        </YGroup>
      </ScrollView>
    </YStack>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
