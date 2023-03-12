import dayjs from 'dayjs'
import { useSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from 'store/hooks'
import { ScrollView, Text, useWindowDimensions, YStack, ZStack } from 'tamagui'
import RenderHtml from 'react-native-render-html'
import { useMemo } from 'react'
import ReaderHeader from 'components/ReaderHeader'
import ReaderToolbar from 'components/ReaderToolbar'
import useTheme from 'hooks/useTheme'

export default function Reader() {
  const flow = useAppSelector((state) => state.feed.flow)
  const sources = useAppSelector((state) => state.feed.sources)
  const fontSize = useAppSelector((state) => state.setting?.reader?.fontSize)
  const fontFamily = useAppSelector(
    (state) => state.setting?.reader?.fontFamily
  )
  const { id } = useSearchParams()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const feed = flow.find((t) => t.entries?.find((m) => m.id === id))
  const item = feed?.entries?.find((t) => t.id === id)
  const source = sources.find((t) => t.url === feed?.url)
  const theme = useTheme()

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
          // StickyHeaderComponent={() => (
          //   <ReaderHeader source={source} item={item} />
          // )}
          stickyHeaderIndices={[0]}
        >
          <ReaderHeader source={source} item={item} />
          <YStack>
            <Text
              fontWeight="bold"
              fontSize={26}
              lineHeight={28}
              color="$color12"
            >
              {item?.title}
            </Text>
            <Text fontSize={12} color="gray">
              {dayjs(item?.published).format('MMM DD, YYYY')}
            </Text>
          </YStack>
          <YStack flex={1}>
            <RenderHtml
              source={{ html: item?.description || '' }}
              enableExperimentalMarginCollapsing
              contentWidth={width}
              systemFonts={[fontFamily, 'Vollkorn', 'Gilroy-Bold']}
              tagsStyles={tagsStyle as any}
            />
          </YStack>
        </ScrollView>

        <ReaderToolbar item={item} />
      </ZStack>
    </YStack>
  )
}
