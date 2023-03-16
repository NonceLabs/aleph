import dayjs from 'dayjs'
import { YStack, Text, XStack, useWindowDimensions } from 'tamagui'
import { Feed, FeedEntry, FeedListType, FeedType } from 'types'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Pressable, StyleSheet, Image, ImageBackground } from 'react-native'
import { useRouter } from 'expo-router'
import Favicon from './Favicon'
import { MAIN_COLOR } from 'lib/constants'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import PlayingEntry from './PlayingEntry'
import { Play } from '@tamagui/lucide-icons'

dayjs.extend(relativeTime)

export default function FeedItem({
  item,
  feed,
  type,
}: {
  item: FeedEntry
  feed?: Feed
  type?: FeedListType
}) {
  const router = useRouter()
  const { width } = useWindowDimensions()
  const withImage = item.cover
  let opacity = 1
  let fontWeight = '600'
  if (['flow', 'tags'].includes(type || '')) {
    if (item.read) {
      opacity = 0.6
      fontWeight = '300'
    }
  } else {
    fontWeight = '400'
  }

  return (
    <Pressable
      style={{ paddingHorizontal: 8 }}
      onPress={() => {
        router.push({
          pathname: 'shared/reader',
          params: {
            id: encodeURIComponent(item.id),
            type,
            feedUrl: encodeURIComponent(item.feedUrl || ''),
          },
        })
      }}
    >
      <XStack
        space={8}
        ai="center"
        jc="center"
        w={width - 16}
        py={8}
        o={opacity}
        borderBottomWidth={StyleSheet.hairlineWidth}
        borderBottomColor="$borderColor"
      >
        <YStack
          paddingVertical={10}
          space={4}
          w={withImage ? width - 120 : width - 32}
        >
          {feed && (
            <XStack space={4} alignItems="center">
              <Favicon favicon={feed.favicon} size={20} />
              <Text
                color="$color11"
                maxWidth={120}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {feed.title}
              </Text>
              <Text fontSize={12} color="$gray10" marginLeft={10}>
                {dayjs(item.published).fromNow()}
              </Text>
            </XStack>
          )}
          <Text
            fontSize={18}
            fontWeight={fontWeight}
            lineHeight={20}
            color="$color12"
          >
            {item.title || 'Untitled'}
          </Text>
        </YStack>
        <Cover item={item} feed={feed} />
      </XStack>
    </Pressable>
  )
}

function Cover({ item, feed }: { item: FeedEntry; feed?: Feed }) {
  const { playing, isPlaying } = useAppSelector((state) => state.feed)
  const dispatch = useAppDispatch()

  if (item.entryType === FeedType.RSS) {
    return item.cover ? (
      <Image
        source={{ uri: item.cover }}
        style={{ height: 80, width: 80 }}
        resizeMode="cover"
      />
    ) : null
  }

  const cover = item.cover || feed?.favicon

  return (
    <Pressable
      onPress={() => {
        dispatch({
          type: 'feed/play',
          payload: item,
        })
      }}
    >
      {playing?.id === item.id && isPlaying ? (
        <PlayingEntry isPlaying={isPlaying} entry={playing} animate />
      ) : (
        <ImageBackground
          source={{ uri: cover }}
          borderRadius={8}
          style={{
            height: 80,
            width: 80,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <XStack bc={MAIN_COLOR} w={50} h={50} ai="center" jc="center" br={25}>
            <Play width={28} height={28} color="white" />
          </XStack>
        </ImageBackground>
      )}
    </Pressable>
  )
}
