import Header from 'components/Header'
import { StyleSheet } from 'react-native'
import { YStack, YGroup, Separator, ListItem, ScrollView } from 'tamagui'
import {
  BookOpen,
  ChevronRight,
  Cloud,
  Moon,
  Star,
  Sun,
} from '@tamagui/lucide-icons'
import { Crown, RssFeed, TextAlt } from 'iconoir-react-native'

export default function SettingsPage() {
  return (
    <YStack flex={1}>
      <Header title="Settings" />
      <ScrollView p={20} pt={0} flex={1}>
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
