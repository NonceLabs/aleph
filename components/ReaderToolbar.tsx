import {
  Bookmark,
  ChevronLeft,
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
import { FeedEntry, FeedListType, FeedType } from 'types'
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
  const dispatch = useAppDispatch()
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
    }
  }

  useEffect(() => {
    async function handle() {
      try {
        let isPlaying = false
        let isQueued = false
        const queue = await TrackPlayer.getQueue()
        const trackIndex = await TrackPlayer.getCurrentTrack()
        if (trackIndex !== null) {
          const track = await TrackPlayer.getTrack(trackIndex)
          isPlaying = track?.id === entry?.id
        }
        isQueued = queue.some((item) => item.id === entry?.id)
        setPlayStatus({ isPlaying, isQueued })
      } catch (error) {
        // Toast.error(error)
      }
    }
    handle()
  }, [entry?.id])

  const onAddToList = async () => {
    try {
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
                <PauseCircle width={28} height={28} color="$color11" />
              ) : (
                <PlayCircle width={28} height={28} color="$color11" />
              )}
            </Pressable>
          )}
          {entry?.entryType === FeedType.Podcast && !playStatus.isQueued && (
            <Pressable onPress={onAddToList}>
              <ListPlus width={28} height={28} color="$color11" />
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
