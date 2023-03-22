import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { MAIN_COLOR } from 'lib/constants'
import { formatStatusTime } from 'lib/helper'
import Toast from 'lib/toast'
import { Pressable } from 'react-native'
import TrackPlayer, { useActiveTrack } from 'react-native-track-player'
import { useAppSelector } from 'store/hooks'
import { Text, XStack, YStack, Separator, useWindowDimensions } from 'tamagui'

export default function PlayList() {
  const { width } = useWindowDimensions()

  const currentTrack = useActiveTrack()
  const queue = useAppSelector((state) => state.feed.playlist)

  return (
    <FlashList
      data={queue}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      estimatedItemSize={83}
      renderItem={({ item, index }) => {
        const isActive = currentTrack?.id === item.id
        return (
          <Pressable
            onPress={async () => {
              try {
                const one = queue[index]
                await TrackPlayer.skip(index, one.position || 0)
                await TrackPlayer.play()
              } catch (error) {
                Toast.error(error)
              }
            }}
          >
            <XStack space={16} px={4} py={8} w={width - 32}>
              <Image
                source={item.artwork}
                style={{ width: 50, height: 50, borderRadius: 4 }}
              />
              <YStack w={width - 100}>
                <Text
                  fontWeight="bold"
                  fontSize={16}
                  color={isActive ? MAIN_COLOR : '$color12'}
                >
                  {item.title}
                </Text>
                <Text fontSize={12} color={isActive ? MAIN_COLOR : '$color11'}>
                  {item.artist}
                </Text>
                {item.position > 0 && item?.duration && item?.duration > 0 && (
                  <Text color="$color11" fontSize={12}>
                    {formatStatusTime(item.position)}/
                    {formatStatusTime(item.duration)}
                  </Text>
                )}
              </YStack>
            </XStack>
          </Pressable>
        )
      }}
      ItemSeparatorComponent={Separator}
    />
  )
}
