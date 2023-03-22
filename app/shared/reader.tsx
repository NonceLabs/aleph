import dayjs from 'dayjs'
import { Link, useSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from 'store/hooks'
import {
  ScrollView,
  Text,
  useWindowDimensions,
  XStack,
  YStack,
  ZStack,
} from 'tamagui'
import RenderHtml from 'react-native-render-html'
import { useEffect, useMemo } from 'react'
import ReaderHeader from 'components/ReaderHeader'
import ReaderToolbar from 'components/ReaderToolbar'
import useTheme from 'hooks/useTheme'
import { StyleSheet } from 'react-native'
import useEntry from 'hooks/useEntry'
import useFeeds from 'hooks/useFeeds'
import { FeedListType } from 'types'

export default function Reader() {
  const { id, type } = useSearchParams()
  const { entry, onUpdateEntry, onToggleBookmark } = useEntry(id as string)
  const { feeds } = useFeeds()
  const fontSize = useAppSelector((state) => state.setting?.reader?.fontSize)
  const fontFamily = useAppSelector(
    (state) => state.setting?.reader?.fontFamily
  )
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const feed = feeds.find((t) => t.url === entry?.feedUrl)

  const theme = useTheme()

  useEffect(() => {
    if (entry && !entry?.read) {
      onUpdateEntry({ ...entry, read: true })
    }
  }, [entry?.read])

  const source = useMemo(() => {
    return { html: entry?.description || '' }
  }, [entry?.description])

  const tagsStyle = useMemo(() => {
    return {
      body: {
        fontSize,
        fontFamily,
        color: theme === 'light' ? 'black' : '#999',
      },
      p: {
        fontFamily,
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
  }, [fontSize, fontFamily, theme])

  return (
    <YStack flex={1}>
      <ZStack flex={1}>
        <ScrollView
          p={16}
          contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
          flex={1}
          space={8}
          stickyHeaderIndices={[0]}
        >
          <ReaderHeader feed={feed} entry={entry} />
          <YStack>
            <Text
              fontWeight="bold"
              fontSize={26}
              lineHeight={28}
              color="$color12"
            >
              {entry?.title || 'Untitled'}
            </Text>
            <Text fontSize={12} color="gray" mt={6}>
              {dayjs(entry?.published).format('MMM DD, YYYY')}
            </Text>
          </YStack>
          {entry?.tags.length ? (
            <XStack flexWrap="wrap">
              {entry.tags.map((tag: string, idx) => {
                const isLast = idx + 1 === entry?.tags?.length
                return (
                  <Link key={idx} href={`shared/entryByTag?tag=${tag}`}>
                    <XStack mr={2} mb={4}>
                      <Text
                        color="$color11"
                        fontFamily="$heading"
                        bbw={StyleSheet.hairlineWidth}
                        bbc="$color11"
                        textDecorationLine="underline"
                      >
                        {tag}
                      </Text>
                      {!isLast && <Text>,</Text>}
                    </XStack>
                  </Link>
                )
              })}
            </XStack>
          ) : null}
          <YStack flex={1}>
            <RenderHtml
              source={source}
              enableExperimentalMarginCollapsing
              contentWidth={width}
              systemFonts={[fontFamily, 'Vollkorn', 'Gilroy-Bold']}
              tagsStyles={tagsStyle as any}
              ignoredDomTags={['audio']}
            />
          </YStack>
        </ScrollView>

        <ReaderToolbar
          entry={entry}
          type={type as FeedListType}
          onUpdateEntry={onUpdateEntry}
          onToggleBookmark={onToggleBookmark}
        />
      </ZStack>
    </YStack>
  )
}
