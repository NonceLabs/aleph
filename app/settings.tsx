import { StyleSheet } from 'react-native'
import { YStack, YGroup, Separator, ListItem, XStack, Text } from 'tamagui'
import { ChevronRight } from '@tamagui/lucide-icons'
import { Lifebelt } from 'iconoir-react-native'
import * as MailComposer from 'expo-mail-composer'
import { ScrollView } from 'react-native'
import DrawerHeader from 'components/DrawerHeader'
import { purgeAllData } from 'lib/db'
import { useNavigation } from 'expo-router'

export default function SettingsPage() {
  const navigation = useNavigation()
  return (
    <YStack flex={1}>
      <DrawerHeader title="Settings" />

      <ScrollView
        style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 16 }}
      >
        <YGroup als="center" bordered size="$5" separator={<Separator />}>
          <YGroup.Item>
            <ListItem
              hoverTheme
              pressTheme
              title="Help"
              px={8}
              icon={<Lifebelt width={24} height={24} />}
              iconAfter={
                <XStack>
                  <ChevronRight width={24} height={24} color="$color9" />
                </XStack>
              }
              onPress={async () => {
                try {
                  await MailComposer.composeAsync({
                    recipients: ['chezhe@hey.com'],
                    subject: 'Help - Aleph Reader',
                    body: 'Hi, I need help with...',
                  })
                } catch (error) {}
              }}
            />
            <ListItem
              hoverTheme
              pressTheme
              title="Destroy"
              px={8}
              icon={<Lifebelt width={24} height={24} />}
              iconAfter={
                <XStack>
                  <ChevronRight width={24} height={24} color="$color9" />
                </XStack>
              }
              onPress={async () => {
                try {
                  await purgeAllData()
                  // @ts-ignore
                  navigation.jumpTo('index')
                } catch (error) {}
              }}
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
