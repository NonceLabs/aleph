import { PauseCircle, PlayCircle } from '@tamagui/lucide-icons'
import { Image } from 'expo-image'
import useFeed from 'hooks/useFeed'
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
  const feed = useFeed(entry.feedUrl)
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
          source={entry.cover || feed?.favicon}
          placeholder={require('../assets/images/cover.png')}
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
