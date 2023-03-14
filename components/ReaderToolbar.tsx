import { BlurView } from 'expo-blur'
import { useNavigation } from 'expo-router'
import useTheme from 'hooks/useTheme'
import { BookmarkEmpty, NavArrowLeft } from 'iconoir-react-native'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { XStack } from 'tamagui'
import { FeedEntry, FeedListType } from 'types'
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
          <NavArrowLeft width={28} height={28} />
        </Pressable>
        <XStack space={24}>
          <Summarize entry={entry} />
          <ReaderSettings />
          <Pressable onPress={onBookmark}>
            <BookmarkEmpty
              width={24}
              height={24}
              color={isBookmarked ? 'blue' : 'gray'}
              strokeWidth={isBookmarked ? 2 : 1.5}
            />
          </Pressable>
        </XStack>
      </XStack>
    </BlurView>
  )
}
