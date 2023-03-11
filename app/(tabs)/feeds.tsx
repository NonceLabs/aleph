import { Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack, XStack, Text, H2 } from 'tamagui'
import PagerView from 'react-native-pager-view'
import AddFeedButton from '../../components/AddFeedButton'
import { useEffect, useRef, useState } from 'react'
import SourceList from 'components/SourceList'
import { useAppDispatch } from 'store/hooks'
import FeedList from 'components/FeedList'
import { AlignRight } from '@tamagui/lucide-icons'
import { fetchFeedFlow, registerBackgroundFetchAsync } from 'lib/task'
import { useRootNavigation, useRouter } from 'expo-router'

export default function FeedPage() {
  const routes = [
    { key: 'feeds', title: 'Feeds' },
    { key: 'sources', title: 'Sources' },
  ]

  const [index, setIndex] = useState(0)
  const pagerRef = useRef<PagerView>(null)
  const insets = useSafeAreaInsets()
  // const navigation = useRootNavigation()
  useEffect(() => {
    fetchFeedFlow()
    registerBackgroundFetchAsync()
    // navigation?.addListener("tabLongPress", () => {})
  }, [])
  const onTabChange = (_index: number) => {
    if (_index !== index) {
      setIndex(_index)
    }
  }
  return (
    <YStack flex={1} backgroundColor="#f7f6f5" paddingTop={insets.top}>
      <FeedList />
      {/* <XStack
        space
        alignItems="center"
        justifyContent="space-between"
        style={{
          paddingTop: insets.top,
          paddingHorizontal: 10,
        }}
      >
        <XStack flex={1} space={10}>
          {routes.map((route, i) => (
            <Pressable
              key={route.key}
              onPress={() => {
                console.log('i', i)
                setIndex(i)
                pagerRef.current?.setPage(i)
              }}
            >
              <H2
                color={index === i ? '$blue1Dark' : '$gray10Light'}
                fontFamily="Gilroy-Bold"
              >
                {route.title}
              </H2>
            </Pressable>
          ))}
        </XStack>
        {index === 0 && <AlignRight size={24} />}
        {index === 1 && <AddFeedButton />}
      </XStack>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={index}
        onPageScroll={(e) => {
          onTabChange(e.nativeEvent.position)
        }}
      >
        <YStack key="0">
          
        </YStack>
        <YStack key="1">
          <SourceList />
        </YStack>
      </PagerView> */}
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
