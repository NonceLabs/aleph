import { Podcast, Rss } from '@tamagui/lucide-icons'
import DrawerHeader from 'components/DrawerHeader'
import FeedSheet from 'components/FeedSheet'
import { Image } from 'expo-image'
import { HOST } from 'lib/constants'
import { fetcher } from 'lib/request'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { YStack, Text, XStack, Sheet, Anchor, Button } from 'tamagui'
import { Feed, FeedType } from 'types'

export default function Explore() {
  const explore = useAppSelector((state) => state.feed.explore || [])
  const dispatch = useAppDispatch()
  const [feed, setFeed] = useState<Feed>()

  useEffect(() => {
    fetcher(`${HOST}/explore`).then((res) => {
      dispatch({
        type: 'feed/setExplore',
        payload: res,
      })
    })
  }, [])

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setFeed(undefined)
    }
  }

  return (
    <YStack flex={1}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        // StickyHeaderComponent={() => <DrawerHeader title="Explore" />}
        stickyHeaderIndices={[0]}
      >
        <DrawerHeader title="Explore" />
        {explore.map((item) => {
          return (
            <YStack key={item.title} px={4} py={8}>
              <Text fontWeight="bold" fontSize={24} color="$color12" mx={16}>
                {item.title}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {item.items.map((item, idx) => {
                  return (
                    <YStack key={idx} space={16} px={4} py={8} mx={16} my={16}>
                      <YStack
                        key={item.title}
                        space={8}
                        onPress={() => setFeed(item)}
                      >
                        <Image
                          source={item.favicon}
                          style={{
                            width: 160,
                            height: 160,
                            borderRadius: 4,
                          }}
                        />
                        <XStack
                          bc="gray"
                          position="absolute"
                          left={0}
                          top={0}
                          padding={4}
                          borderTopLeftRadius={4}
                          borderBottomRightRadius={4}
                        >
                          {item.type === FeedType.Podcast ? (
                            <Podcast size={24} color="white" />
                          ) : (
                            <Rss size={24} color="white" />
                          )}
                        </XStack>
                        <YStack>
                          <Text
                            fontSize={16}
                            color="$color11"
                            maxWidth={150}
                            numberOfLines={1}
                          >
                            {item.title}
                          </Text>
                        </YStack>
                      </YStack>
                    </YStack>
                  )
                })}
              </ScrollView>
            </YStack>
          )
        })}
      </ScrollView>
      <FeedSheet feed={feed} onOpenChange={onOpenChange} />
    </YStack>
  )
}
