import {
  Bookmark,
  ChevronLeft,
  ListMinus,
  ListPlus,
  PauseCircle,
  PlayCircle,
} from '@tamagui/lucide-icons'
import { BlurView } from 'expo-blur'
import { useNavigation } from 'expo-router'
import useFeed from 'hooks/useFeed'
import useTheme from 'hooks/useTheme'
import { MAIN_COLOR } from 'lib/constants'
import icons from 'lib/icons'
import Toast from 'lib/toast'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TrackPlayer from 'react-native-track-player'
import { useAppDispatch } from 'store/hooks'
import { XStack } from 'tamagui'
import { FeedEntry, FeedListType, FeedType, PubEvent } from 'types'
import ReaderSettings from './ReaderSettings'
import Summarize from './Summarize'

export default function ReaderToolbar({
  entry,
  type,
  onUpdateEntry,
  onToggleBookmark,
}: {
  entry?: FeedEntry
  type?: FeedListType
  onUpdateEntry: (entry: FeedEntry) => void
  onToggleBookmark: (entry: FeedEntry) => void
}) {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const feed = useFeed(entry?.feedUrl)
  const [playStatus, setPlayStatus] = useState({
    isPlaying: false,
    isQueued: false,
  })
  const isBookmarked = entry?.bookmarked
  const onBack = () => {
    let pathname = 'index'
    if (type === 'flow') {
      pathname = 'index'
    } else if (type === 'bookmarks') {
      pathname = 'bookmarks'
    } else if (type === 'feeds') {
      pathname = 'feeds'
    }
    // @ts-ignore
    navigation.jumpTo(pathname)
  }
  const onBookmark = () => {
    if (entry) {
      onToggleBookmark({ ...entry, bookmarked: !isBookmarked })
      Toast.success(isBookmarked ? 'Unbookmarked' : 'Bookmarked')
    }
  }

  useEffect(() => {
    async function handle() {
      try {
        const queue = await TrackPlayer.getQueue()
        const track = await TrackPlayer.getActiveTrack()
        const isPlaying = track?.id === entry?.id
        const isQueued = queue.some((item) => item.id === entry?.id)
        setPlayStatus({ isPlaying, isQueued })
      } catch (error) {
        // Toast.error(error)
      }
    }
    handle()
  }, [entry?.id])

  const onAddToList = async () => {
    try {
      if (playStatus.isQueued) {
        const queue = await TrackPlayer.getQueue()
        const idx = queue.findIndex((item) => item.id === entry?.id)
        await TrackPlayer.remove(idx)
        if (playStatus.isPlaying) {
          await TrackPlayer.skipToNext()
        }
        Toast.success('Removed from queue')
        setPlayStatus({ isPlaying: false, isQueued: false })
      } else {
        await TrackPlayer.add({
          id: entry?.id,
          url: entry?.media!,
          title: entry?.title,
          artist: feed?.title,
          artwork: entry?.cover || feed?.favicon || icons.DEFAULT_COVER,
        })
        setPlayStatus({ isPlaying: false, isQueued: true })
        Toast.success('Added to queue')
      }
      PubSub.publish(PubEvent.TRACK_QUEUE_UPDATE)
    } catch (error) {
      Toast.error(error)
    }
  }

  const onPlay = async () => {
    try {
      if (playStatus.isPlaying) {
        TrackPlayer.pause()
      } else if (playStatus.isQueued) {
        TrackPlayer.play()
      } else {
        TrackPlayer.add(
          {
            id: entry?.id,
            url: entry?.media!,
            title: entry?.title,
            artist: feed?.title,
            artwork: entry?.cover || feed?.favicon || icons.DEFAULT_COVER,
          },
          0
        )
        TrackPlayer.play()
      }
      PubSub.publish(PubEvent.TRACK_QUEUE_UPDATE)
    } catch (error) {
      Toast.error(error)
    }
  }

  return (
    <BlurView
      intensity={80}
      tint={theme}
      style={{ position: 'absolute', bottom: 0, width: '100%' }}
    >
      <XStack
        space
        pb={insets.bottom}
        px={20}
        justifyContent="space-between"
        pt={8}
      >
        <Pressable hitSlop={16} onPress={onBack}>
          <ChevronLeft width={32} height={32} color="$blue10" />
        </Pressable>
        <XStack space={24}>
          {entry?.entryType === FeedType.RSS && <Summarize entry={entry} />}
          {entry?.entryType === FeedType.RSS && <ReaderSettings />}
          {entry?.entryType === FeedType.Podcast && (
            <Pressable onPress={onPlay}>
              {playStatus.isPlaying ? (
                <PauseCircle size={28} color="$color11" />
              ) : (
                <PlayCircle size={28} color="$color11" />
              )}
            </Pressable>
          )}
          {entry?.entryType === FeedType.Podcast && (
            <Pressable onPress={onAddToList}>
              {playStatus.isQueued ? (
                <ListMinus size={28} color="$color11" />
              ) : (
                <ListPlus size={28} color="$color11" />
              )}
            </Pressable>
          )}

          <Pressable onPress={onBookmark}>
            <Bookmark
              width={28}
              height={28}
              color={isBookmarked ? MAIN_COLOR : '$color11'}
              strokeWidth={isBookmarked ? 2 : 1.5}
            />
          </Pressable>
        </XStack>
      </XStack>
    </BlurView>
  )
}
