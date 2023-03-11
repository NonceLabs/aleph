import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
import { useEffect } from 'react'
import FeedList from 'components/FeedList'
import { fetchFeedFlow, registerBackgroundFetchAsync } from 'lib/task'

export default function FlowPage() {
  const insets = useSafeAreaInsets()
  // const navigation = useRootNavigation()
  useEffect(() => {
    fetchFeedFlow()
    registerBackgroundFetchAsync()
    // navigation?.addListener("tabLongPress", () => {})
  }, [])

  return (
    <YStack flex={1} backgroundColor="#f7f6f5" paddingTop={insets.top}>
      <FeedList />
    </YStack>
  )
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
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
