import dayjs from 'dayjs'
import { YStack, Text, XStack, useWindowDimensions, Spinner } from 'tamagui'
import { Feed, FeedEntry, FeedListType, FeedType, PubEvent } from 'types'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Favicon from 'components/Favicon'
import { ListMusic, Pause, PlayCircle } from '@tamagui/lucide-icons'
import { Image } from 'expo-image'
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player'
import icons from 'lib/icons'
import { useAppSelector } from 'store/hooks'
import TrackStatus from '../Player/TrackStatus'

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
  const withImage = item.cover || item.entryType === FeedType.Podcast
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
          w={withImage ? width - 110 : width - 32}
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
  const placeholder = icons.DEFAULT_COVER
  const queue = useAppSelector((state) => state.feed.playlist)

  if (item.entryType === FeedType.RSS) {
    return item.cover ? (
      <Image
        source={item.cover}
        placeholder={placeholder}
        style={{ height: 80, width: 80 }}
        contentFit="cover"
      />
    ) : null
  }

  const cover = item.cover || feed?.favicon || placeholder
  const queuedIdx = queue.findIndex((t) => t.url === item.media)

  return (
    <Pressable
      onPress={async () => {
        try {
          // queued
          if (queuedIdx !== -1) {
            if (queue[queuedIdx]?.playing === State.Playing) {
              await TrackPlayer.pause()
            } else if (
              [State.Paused, State.None].includes(queue[queuedIdx]?.playing)
            ) {
              await TrackPlayer.pause()
              await TrackPlayer.skip(queuedIdx)
              await TrackPlayer.play()
            }
          } else {
            const idx = await TrackPlayer.add(
              {
                id: item.id,
                url: item.media!,
                title: item.title,
                artist: feed?.title,
                artwork: cover,
              },
              0
            )

            PubSub.publish(PubEvent.TRACK_QUEUE_UPDATE)
            if (typeof idx === 'number') {
              await TrackPlayer.pause()
              await TrackPlayer.skip(idx)
              await TrackPlayer.play()
            }
          }
        } catch (error) {
          console.log('error', error)
        }
      }}
    >
      <XStack>
        <Image
          source={{ uri: cover }}
          placeholder={placeholder}
          style={{ height: 80, width: 80, borderRadius: 8 }}
          blurRadius={16}
        />
        <XStack position="absolute" top={20} left={20}>
          <TrackStatus
            state={queue[queuedIdx]?.playing}
            queued={queuedIdx !== -1}
          />
        </XStack>
        {queuedIdx !== -1 && (
          <XStack
            position="absolute"
            top={60}
            left={60}
            p={4}
            bc="gray"
            borderTopLeftRadius={8}
            borderBottomRightRadius={8}
          >
            <ListMusic size={12} color="white" />
          </XStack>
        )}
      </XStack>
    </Pressable>
  )
}
