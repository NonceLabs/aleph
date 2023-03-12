import dayjs from 'dayjs'
import { Image } from 'expo-image'
import { YStack, Text, XStack, useWindowDimensions } from 'tamagui'
import { FeedEntry, Source } from 'types'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { extractImages } from 'lib/helper'
import { useAppDispatch } from 'store/hooks'

dayjs.extend(relativeTime)

export default function FeedItem({
  item,
  source,
}: {
  item: FeedEntry
  source?: Source
}) {
  const router = useRouter()
  const images = extractImages(item.description)
  const { width } = useWindowDimensions()
  const dispatch = useAppDispatch()
  const withImage = images.length > 0

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
      <XStack
        space={8}
        ai="center"
        jc="center"
        w={width}
        py={8}
        o={item?.read ? 0.6 : 1}
      >
        <YStack
          paddingVertical={10}
          space={4}
          borderBottomWidth={StyleSheet.hairlineWidth}
          borderBottomColor="$borderColor"
          w={withImage ? width - 120 : width - 32}
        >
          {source && (
            <XStack space={4} alignItems="center">
              {source.logo && (
                <Image
                  source={source.logo}
                  style={{ width: 20, height: 20, borderRadius: 4 }}
                />
              )}
              <Text>{source.title}</Text>
              <Text fontSize={12} color="$gray10" marginLeft={10}>
                {dayjs(item.published).fromNow()}
              </Text>
            </XStack>
          )}
          <Text
            fontSize={18}
            fontWeight={item?.read ? '300' : '600'}
            lineHeight={20}
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
