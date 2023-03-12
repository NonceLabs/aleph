import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { XStack, YStack } from 'tamagui'
import { useEffect } from 'react'
import FeedList from 'components/FeedList'
import { fetchFeedFlow, registerBackgroundFetchAsync } from 'lib/task'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import dayjs from 'dayjs'
import _ from 'lodash'
import { FeedEntry } from 'types'
import { Jellyfish } from 'iconoir-react-native'
import Shortcut from 'components/Shortcut'

export default function FlowPage() {
  const entries = useAppSelector((state) =>
    state.feed.flow.map((t) => t.entries || [])
  )
  const hideRead = useAppSelector((state) => state.setting.flow.hideRead)
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

  const feeds = _.flatten(entries).sort((a: FeedEntry, b: FeedEntry) =>
    dayjs(b.published).diff(dayjs(a.published))
  )
  // if (hideRead) {
  //   feeds = feeds.filter((t) => !t.read)
  // }#f6eee3
  return (
    <YStack flex={1} backgroundColor="$background">
      <FeedList feeds={feeds} />
      {/* <Shortcut /> */}
    </YStack>
  )
}
