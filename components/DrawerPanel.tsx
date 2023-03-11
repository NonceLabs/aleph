import { Link } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, YStack } from 'tamagui'

export default function DrawerPanel() {
  const insets = useSafeAreaInsets()
  const fontSize = 32
  return (
    <YStack
      flex={1}
      pt={insets.top}
      pb={insets.bottom}
      space
      px={8}
      justifyContent="center"
    >
      <YStack width="100%" space={8}>
        <Link href="/">
          <Text
            textAlign="right"
            fontWeight="bold"
            fontSize={fontSize}
            fontFamily="Gilroy-Bold"
            width={200}
          >
            Home
          </Text>
        </Link>
        <Link href="/feeds">
          <Text
            textAlign="right"
            fontWeight="bold"
            fontSize={fontSize}
            fontFamily="Gilroy-Bold"
            width={200}
          >
            Feeds
          </Text>
        </Link>
        <Link href="/settings">
          <Text
            textAlign="right"
            fontWeight="bold"
            fontSize={fontSize}
            fontFamily="Gilroy-Bold"
          >
            Settings
          </Text>
        </Link>
      </YStack>
    </YStack>
  )
}
