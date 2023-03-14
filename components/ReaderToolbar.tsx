import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import useTheme from 'hooks/useTheme'
import { BookmarkEmpty, NavArrowLeft } from 'iconoir-react-native'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { XStack } from 'tamagui'
import { FeedEntry } from 'types'
import ReaderSettings from './ReaderSettings'
import * as Sharing from 'expo-sharing'
import Summarize from './Summarize'

export default function ReaderToolbar({ item }: { item?: FeedEntry }) {
  const theme = useTheme()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const bookmarked = useAppSelector((state) => state.feed.bookmarked)
  const dispatch = useAppDispatch()
  const isBookmarked = bookmarked.some((t) => t.id === item?.id)
  const onBookmark = () => {
    dispatch({
      type: 'feed/bookmark',
      payload: item,
    })
  }
  const onShare = async () => {
    try {
      await Sharing.shareAsync(item?.link!, {
        mimeType: 'text/html',
        dialogTitle: item?.title,
        UTI: item?.link,
      })
    } catch (error) {
      console.log('error sharing', error)
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
        <Pressable hitSlop={16} onPress={() => router.back()}>
          <NavArrowLeft width={28} height={28} />
        </Pressable>
        <XStack space={24}>
          <Summarize entry={item} />
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
