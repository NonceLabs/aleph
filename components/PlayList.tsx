import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { useActiveTrack } from 'hooks/useActiveTrack'
import { MAIN_COLOR } from 'lib/constants'
import Toast from 'lib/toast'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import TrackPlayer from 'react-native-track-player'
import { Text, XStack, YStack, Separator, useWindowDimensions } from 'tamagui'

export default function PlayList() {
  const [tracks, setTracks] = useState<any[]>([])
  const { width } = useWindowDimensions()

  const track = useActiveTrack()

  useEffect(() => {
    TrackPlayer.getQueue().then(setTracks)
  }, [track?.id])

  return (
    <FlashList
      data={tracks}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      estimatedItemSize={83}
      renderItem={({ item, index }) => {
        const isActive = track?.id === item.id
        return (
          <Pressable
            onPress={async () => {
              try {
                await TrackPlayer.skip(index)
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
                <Text>{item.duration}</Text>
              </YStack>
            </XStack>
          </Pressable>
        )
      }}
      ItemSeparatorComponent={Separator}
    />
  )
}