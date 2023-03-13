import dayjs from 'dayjs'
import { Image } from 'expo-image'
import { YStack, Text, XStack, useWindowDimensions } from 'tamagui'
import { FeedEntry, FeedListType, Source } from 'types'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { extractImages } from 'lib/helper'
import { useAppDispatch } from 'store/hooks'
import Favicon from './Favicon'

dayjs.extend(relativeTime)

export default function FeedItem({
  item,
  source,
  type,
}: {
  item: FeedEntry
  source?: Source
  type?: FeedListType
}) {
  const router = useRouter()
  const images = extractImages(item.description)
  const { width } = useWindowDimensions()
  const dispatch = useAppDispatch()
  const withImage = images.length > 0
  let opacity = 1
  let fontWeight = '600'
  if (['flow', 'tags'].includes(type || '')) {
    if (item.read) {
      opacity = 0.6
      fontWeight = '300'
    }
  } else {
    fontWeight = '400'
  }
  return (
    <Pressable
      onPress={() => {
        dispatch({
          type: 'feed/read',
          payload: {
            url: item.sourceUrl,
            id: item.id,
          },
        })
        router.push({
          pathname: 'reader',
          params: {
            id: encodeURIComponent(item.id),
          },
        })
      }}
    >
      <XStack space={8} ai="center" jc="center" w={width} py={8} o={opacity}>
        <YStack
          paddingVertical={10}
          space={4}
          borderBottomWidth={StyleSheet.hairlineWidth}
          borderBottomColor="$borderColor"
          w={withImage ? width - 120 : width - 32}
        >
          {source && (
            <XStack space={4} alignItems="center">
              <Favicon favicon={source.favicon} size={20} />
              <Text color="$color11">{source.title}</Text>
              <Text fontSize={12} color="$gray10" marginLeft={10}>
                {dayjs(item.published).fromNow()}
              </Text>
            </XStack>
          )}
          <Text
            fontSize={18}
            fontWeight={fontWeight}
            lineHeight={20}
            color="$color12"
          >
            {item.title || 'Untitled'}
          </Text>
        </YStack>
        {images.length > 0 && (
          <Image
            source={{ uri: images[0] }}
            style={{ height: 80, width: 80, borderRadius: 4 }}
            contentFit="cover"
          />
        )}
      </XStack>
    </Pressable>
  )
}
