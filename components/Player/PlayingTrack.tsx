import { Image } from 'expo-image'
import icons from 'lib/icons'
import { useEffect, useRef } from 'react'
import { Animated, Easing, Pressable } from 'react-native'
import { Track, usePlaybackState } from 'react-native-track-player'
import { XStack } from 'tamagui'
import TrackStatus from './TrackStatus'

export default function PlayingTrack({
  track,
  animate = false,
  isPlaying,
  size = 80,
  onPress,
}: {
  track: Track
  isPlaying: boolean
  animate?: boolean
  size?: number
  onPress?: () => void
}) {
  const playbackState = usePlaybackState()
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
        <XStack position="absolute" top={size / 2 - 12} left={size / 2 - 12}>
          <TrackStatus queued state={playbackState.state} size={24} />
        </XStack>
      </Animated.View>
    </Pressable>
  )
}
