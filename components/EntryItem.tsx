import dayjs from 'dayjs'
import { YStack, Text, XStack, useWindowDimensions } from 'tamagui'
import { Feed, FeedEntry, FeedListType, FeedType } from 'types'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Favicon from './Favicon'
import { PlayCircle } from '@tamagui/lucide-icons'
import { Image } from 'expo-image'
import TrackPlayer from 'react-native-track-player'
import icons from 'lib/icons'

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

  return (
    <Pressable
      onPress={async () => {
        try {
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
          console.log('idx', idx)

          if (typeof idx === 'number') {
            await TrackPlayer.skipToNext(idx)
            await TrackPlayer.play()
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
          blurRadius={15}
        />
        <XStack position="absolute" top={20} left={20}>
          <PlayCircle size={40} color="white" />
        </XStack>
      </XStack>
    </Pressable>
  )
}
