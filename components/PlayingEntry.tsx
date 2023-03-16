import { Pause, Play } from 'iconoir-react-native'
import { MAIN_COLOR } from 'lib/constants'
import { useEffect, useRef } from 'react'
import { Animated, Easing, ImageBackground, Pressable } from 'react-native'
import { useAppDispatch } from 'store/hooks'
import { XStack } from 'tamagui'
import { FeedEntry } from 'types'

const AnimetedImage = Animated.createAnimatedComponent(ImageBackground)

export default function PlayingEntry({
  playing,
  isPlaying,
  size = 80,
}: {
  playing: FeedEntry
  isPlaying: boolean
  size?: number
}) {
  const dispatch = useAppDispatch()
  const spinValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start()
    }
  }, [isPlaying, spinValue])

  return (
    <Pressable
      onPress={() => {
        dispatch({
          type: 'feed/play',
          payload: playing,
        })
      }}
    >
      <AnimetedImage
        source={{
          uri: playing.cover,
        }}
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [
            {
              rotate: spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}
        borderRadius={size / 2}
      >
        <XStack
          bc={MAIN_COLOR}
          w={50}
          h={50}
          ai="center"
          jc="center"
          br={25}
          o={0.7}
        >
          {isPlaying ? (
            <Pause width={28} height={28} color="white" />
          ) : (
            <Play width={28} height={28} color="white" />
          )}
        </XStack>
      </AnimetedImage>
    </Pressable>
  )
}
