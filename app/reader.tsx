import dayjs from 'dayjs'
import { Image } from 'expo-image'
import { useNavigation, useRouter, useSearchParams } from 'expo-router'
import {
  BookmarkEmpty,
  Compass,
  DeleteCircle,
  ShareIos,
} from 'iconoir-react-native'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from 'store/hooks'
import { Heading, Paragraph, ScrollView, Text, XStack, YStack } from 'tamagui'
import * as WebBrowser from 'expo-web-browser'
import Header from 'components/Header'

export default function Reader() {
  const flow = useAppSelector((state) => state.feed.flow)
  const sources = useAppSelector((state) => state.feed.sources)
  const { id } = useSearchParams()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const navigation = useNavigation()
  const feed = flow.find((t) => t.entries?.find((m) => m.id === id))
  const item = feed?.entries?.find((t) => t.id === id)
  const source = sources.find((t) => t.link === feed?.link)

  return (
    <YStack flex={1}>
      <Header
        title="Back"
        back
        right={
          source && (
            <XStack space={8} pr={8}>
              <Text fontWeight="bold" fontSize={20}>
                {source.title}
              </Text>
              {source?.logo && (
                <Image
                  source={source?.logo}
                  style={{ width: 24, height: 24, borderRadius: 4 }}
                />
              )}
            </XStack>
          )
        }
      />
      {/* <XStack
        px={16}
        pb={10}
        alignItems="center"
        justifyContent="space-between"
      >
        <Pressable onPress={() => router.back()}>
          
        </Pressable>

        {source && (
          <XStack space={8}>
            <Text fontWeight="bold" fontSize={20}>
              {source.title}
            </Text>
            {source?.logo && (
              <Image
                source={source?.logo}
                style={{ width: 24, height: 24, borderRadius: 4 }}
              />
            )}
          </XStack>
        )}
      </XStack> */}

      <ScrollView
        p={16}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        flex={1}
        space={8}
      >
        <Heading lineHeight={28}>{item?.title}</Heading>
        <Text fontSize={12} color="gray">
          {dayjs(item?.published).format('MMM DD, YYYY')}
        </Text>
        <Paragraph>{item?.description}</Paragraph>
      </ScrollView>

      <XStack
        space
        pb={insets.bottom}
        px={20}
        justifyContent="space-around"
        backgroundColor="$background"
        pt={8}
      >
        {(item?.link || item?.id.startsWith('http')) && (
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync(item.link || item?.id)}
          >
            <Compass width={28} height={28} />
          </Pressable>
        )}
        <BookmarkEmpty width={28} height={28} />
        <ShareIos width={28} height={28} />
      </XStack>
    </YStack>
  )
}
