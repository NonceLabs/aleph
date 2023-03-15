import { Link, usePathname } from 'expo-router'
import { StyleSheet } from 'react-native'
import { Heading, YStack, Text, XStack } from 'tamagui'

export default function NotFoundScreen() {
  const pathname = usePathname()

  return (
    <YStack flex={1} ai="center" jc="center" space={4}>
      <Heading color="$color12">404</Heading>
      <XStack>
        <Text color="$color10">Invalid pathname </Text>
        <Text color="$red10">{pathname}</Text>
      </XStack>
      <Link href="index">
        <Text color="$blue11">Go Home</Text>
      </Link>
    </YStack>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
})
