import { PauseCircle, PlayCircle } from '@tamagui/lucide-icons'
import { Image } from 'expo-image'
import icons from 'lib/icons'
import { useEffect, useRef } from 'react'
import { Animated, Easing, Pressable } from 'react-native'
import { Track } from 'react-native-track-player'
import { XStack } from 'tamagui'

export default function PlayingTrack({
  track,
  animate = false,
  isPlaying,
  size = 80,
  withControl = true,
  onPress,
}: {
  track: Track
  isPlaying: boolean
  animate?: boolean
  size?: number
  withControl?: boolean
  onPress?: () => void
}) {
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
    <Pressable onPress={onPress}>
      <Animated.View
        style={{
          transform: [
            {
              rotate: spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}
      >
        <Image
          source={track?.artwork}
          placeholder={icons.DEFAULT_COVER}
          style={{ height: size, width: size, borderRadius: size / 2 }}
          blurRadius={isPlaying ? 10 : 5}
        />
        {withControl && (
          <XStack position="absolute" top={size / 2 - 20} left={size / 2 - 20}>
            {isPlaying ? (
              <PauseCircle width={40} height={40} color="white" />
            ) : (
              <PlayCircle width={40} height={40} color="white" />
            )}
          </XStack>
        )}
      </Animated.View>
    </Pressable>
  )
}
