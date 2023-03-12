import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
import { useEffect } from 'react'
import FeedList from 'components/FeedList'
import { fetchFeedFlow, registerBackgroundFetchAsync } from 'lib/task'
import { useAppDispatch } from 'store/hooks'

export default function FlowPage() {
  const insets = useSafeAreaInsets()
  // const navigation = useRootNavigation()
  const dispatch = useAppDispatch()
  useEffect(() => {
    fetchFeedFlow()
    registerBackgroundFetchAsync()
    // navigation?.addListener("tabLongPress", () => {})
    // dispatch({
    //   type: 'feed/addSource',
    //   payload: {
    //     title: '一天世界',
    //     url: 'https://blog.yitianshijie.net/feed/',
    //     description: '一天世界，昆亂不擋。Lawrence Li 主理。IPN 出品。',
    //     link: 'https://blog.yitianshijie.net',
    //     logo: 'https://blog.yitianshijie.net/favicon.ico',
    //   },
    // })
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
