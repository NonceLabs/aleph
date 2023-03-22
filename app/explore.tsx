import { Podcast, Rss } from '@tamagui/lucide-icons'
import DrawerHeader from 'components/DrawerHeader'
import Favicon from 'components/Favicon'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import useFeeds from 'hooks/useFeeds'
import { HOST, MAIN_COLOR } from 'lib/constants'
import { resubFeed, subFeed, unsubFeed } from 'lib/db'
import icons from 'lib/icons'
import { fetcher } from 'lib/request'
import Toast from 'lib/toast'
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
  const [position, setPosition] = useState(0)

  const { feeds } = useFeeds()
  const oldSub = feeds.find((f) => f.url === feed?.url)

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

  const onSub = async () => {
    try {
      if (!feed) {
        throw new Error("Can't subscribe to undefined feed")
      }
      if (oldSub) {
        if (oldSub.deleted) {
          await resubFeed(feed)
        } else {
          await unsubFeed(feed)
        }
      } else {
        await subFeed(feed)
      }
      setFeed(undefined)
      Toast.success('Subscribed!')
    } catch (error) {
      Toast.error(error)
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
      <Sheet
        forceRemoveScrollEnabled={!!feed}
        modal
        open={!!feed}
        onOpenChange={onOpenChange}
        snapPoints={[40]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame f={1} p="$4">
          {feed && (
            <YStack ai="center" space={8} px={16}>
              <Favicon favicon={feed.favicon} size={72} />
              <Text
                fontSize={20}
                fontWeight="bold"
                color="$color12"
                ta="center"
                numberOfLines={1}
              >
                {feed.title}
              </Text>
              <YStack space={0} ai="center">
                <Text
                  fontSize={16}
                  color="$color11"
                  numberOfLines={3}
                  ta="center"
                >
                  {feed.description}
                </Text>
                <Anchor
                  href={feed.url}
                  color="$blue10"
                  numberOfLines={1}
                  ta="center"
                >
                  {feed.url}
                </Anchor>
              </YStack>
              <Button bc={MAIN_COLOR} color="white" onPress={onSub}>
                {oldSub && !oldSub.deleted ? 'Unsubscribe' : 'Subscribe'}
              </Button>
            </YStack>
          )}
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
