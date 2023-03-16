import { Pause, Play } from '@tamagui/lucide-icons'
import { MAIN_COLOR } from 'lib/constants'
import { useEffect, useRef } from 'react'
import { Animated, Easing, ImageBackground, Pressable } from 'react-native'
import { useAppDispatch } from 'store/hooks'
import { XStack } from 'tamagui'
import { FeedEntry } from 'types'

const AnimetedImage = Animated.createAnimatedComponent(ImageBackground)

export default function PlayingEntry({
  entry,
  animate = false,
  isPlaying,
  size = 80,
  withControl = true,
  onPress,
}: {
  entry: FeedEntry
  isPlaying: boolean
  animate?: boolean
  size?: number
  withControl?: boolean
  onPress?: () => void
}) {
  const dispatch = useAppDispatch()
  const spinValue = useRef(new Animated.Value(0)).current
  const anim = useRef(
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )
  ).current

  useEffect(() => {
    if (isPlaying && animate) {
      anim.start()
    } else if (!isPlaying) {
      anim.reset()
      // anim.stop()
    }
  }, [isPlaying, anim, animate])

  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          onPress()
        } else {
          dispatch({
            type: 'feed/play',
            payload: entry,
          })
        }
      }}
    >
      <AnimetedImage
        source={{
          uri: entry.cover,
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
        {withControl && (
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
        )}
      </AnimetedImage>
    </Pressable>
  )
}
