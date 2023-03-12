import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import useTheme from 'hooks/useTheme'
import { BookmarkEmpty, NavArrowLeft, ShareIos } from 'iconoir-react-native'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { XStack } from 'tamagui'
import { FeedEntry } from 'types'
import ReaderSettings from './ReaderSettings'
import * as Sharing from 'expo-sharing'

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
        bc="rgba(255,255,255,0.9)"
        pt={8}
      >
        <Pressable onPress={() => router.back()}>
          <NavArrowLeft width={28} height={28} />
        </Pressable>
        <XStack space={24}>
          {/* <Play width={24} height={24} color="gray" /> */}
          <ReaderSettings />
          <Pressable onPress={onBookmark}>
            <BookmarkEmpty
              width={24}
              height={24}
              color={isBookmarked ? 'blue' : 'gray'}
              strokeWidth={isBookmarked ? 2 : 1.5}
            />
          </Pressable>
          <Pressable onPress={onShare}>
            <ShareIos width={24} height={24} color="gray" />
          </Pressable>
        </XStack>
      </XStack>
    </BlurView>
  )
}
