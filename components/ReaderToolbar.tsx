import {
  Bookmark,
  ChevronLeft,
  ListPlus,
  Pause,
  PauseCircle,
  Play,
  PlayCircle,
} from '@tamagui/lucide-icons'
import { BlurView } from 'expo-blur'
import { useNavigation } from 'expo-router'
import useTheme from 'hooks/useTheme'
import { MAIN_COLOR } from 'lib/constants'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from 'store/hooks'
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
  const { isPlaying, playing } = useAppSelector((state) => state.feed)
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

  const onAddToList = () => {
    dispatch({
      type: 'feed/addToList',
      payload: entry,
    })
  }

  const onPlay = () => {
    dispatch({
      type: 'feed/play',
      payload: entry,
    })
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
              {isPlaying && entry.id === playing?.id ? (
                <PauseCircle width={28} height={28} color="$color11" />
              ) : (
                <PlayCircle width={28} height={28} color="$color11" />
              )}
            </Pressable>
          )}
          {entry?.entryType === FeedType.Podcast &&
            entry.id !== playing?.id &&
            !isPlaying && (
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
