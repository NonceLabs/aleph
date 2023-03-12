import { usePathname } from 'expo-router'
import { StyleSheet } from 'react-native'
import { Heading, YStack } from 'tamagui'

export default function NotFoundScreen() {
  const pathname = usePathname()
  console.log('pathname', pathname)

  return (
    <YStack flex={1}>
      <Heading>404</Heading>
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
