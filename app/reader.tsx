import dayjs from 'dayjs'
import { Image } from 'expo-image'
import { useNavigation, useRouter, useSearchParams } from 'expo-router'
import {
  BookmarkEmpty,
  Compass,
  DeleteCircle,
  NavArrowLeft,
  Play,
  ShareIos,
  TextSize,
} from 'iconoir-react-native'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  Heading,
  Paragraph,
  ScrollView,
  Text,
  useWindowDimensions,
  XStack,
  YStack,
} from 'tamagui'
import * as WebBrowser from 'expo-web-browser'
import RenderHtml from 'react-native-render-html'
import ReaderSettings from 'components/ReaderSettings'
import { useMemo } from 'react'

export default function Reader() {
  const flow = useAppSelector((state) => state.feed.flow)
  const sources = useAppSelector((state) => state.feed.sources)
  const fontSize = useAppSelector((state) => state.setting?.reader?.fontSize)
  const { id } = useSearchParams()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { width } = useWindowDimensions()
  const navigation = useNavigation()
  const dispatch = useAppDispatch()
  const feed = flow.find((t) => t.entries?.find((m) => m.id === id))
  const item = feed?.entries?.find((t) => t.id === id)
  const source = sources.find((t) => t.link === feed?.link)
  const bookmarked = useAppSelector((state) => state.feed.bookmarked)
  const isBookmarked = bookmarked.some((t) => t.id === item?.id)

  const tagsStyle = useMemo(() => {
    return {
      body: {
        fontSize,
        fontFamily: 'Vollkorn',
      },
      p: {
        fontFamily: 'Vollkorn',
      },
      figcaption: {
        fontStyle: 'italic',
        fontSize: 14,
      },
      cite: {
        fontStyle: 'italic',
        fontSize: 14,
        textAlign: 'center',
      },
    }
  }, [fontSize])
  const onBookmark = () => {
    dispatch({
      type: 'feed/bookmark',
      payload: item,
    })
  }

  return (
    <YStack flex={1} pt={insets.top}>
      <XStack
        space
        px={16}
        py={4}
        alignItems="center"
        justifyContent="space-between"
      >
        {source && (
          <Pressable
            onPress={() =>
              router.push({
                pathname: 'feed',
                params: {
                  ...source,
                  id: '',
                  link: source.link ? encodeURIComponent(source.link) : '',
                  url: encodeURIComponent(source.url),
                  logo: source.logo ? encodeURIComponent(source.logo) : '',
                },
              })
            }
          >
            <XStack space={8} alignItems="center">
              {source?.logo && (
                <Image
                  source={source?.logo}
                  style={{ width: 24, height: 24, borderRadius: 4 }}
                />
              )}
              <Text fontWeight="bold" fontSize={20} color="$blue10Light">
                {source.title}
              </Text>
            </XStack>
          </Pressable>
        )}
        <XStack space={8}>
          {(item?.link || item?.id.startsWith('http')) && (
            <Pressable
              onPress={() => WebBrowser.openBrowserAsync(item.link || item?.id)}
            >
              <Compass width={24} height={24} color="gray" />
            </Pressable>
          )}
        </XStack>
      </XStack>

      <ScrollView
        p={16}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        flex={1}
        space={8}
      >
        <Text fontWeight="bold" fontSize={26} lineHeight={28}>
          {item?.title}
        </Text>
        <Text fontSize={12} color="gray">
          {dayjs(item?.published).format('MMM DD, YYYY')}
        </Text>
        <RenderHtml
          source={{ html: item?.description || '' }}
          enableExperimentalMarginCollapsing
          contentWidth={width}
          systemFonts={['Vollkorn', 'Gilroy-Bold']}
          tagsStyles={tagsStyle as any}
        />
      </ScrollView>

      <XStack
        space
        pb={insets.bottom}
        px={20}
        justifyContent="space-between"
        backgroundColor="$background"
        pt={8}
      >
        <Pressable onPress={() => router.back()}>
          <NavArrowLeft width={28} height={28} />
        </Pressable>
        <XStack space={16}>
          <Play width={24} height={24} color="gray" />
          <ReaderSettings />
          <Pressable onPress={onBookmark}>
            <BookmarkEmpty
              width={24}
              height={24}
              color={isBookmarked ? 'blue' : 'gray'}
              strokeWidth={isBookmarked ? 2 : 1.5}
            />
          </Pressable>
          <ShareIos width={24} height={24} color="gray" />
        </XStack>
      </XStack>
    </YStack>
  )
}
