import { MAIN_COLOR } from 'lib/constants'
import { formatStatusTime } from 'lib/helper'
import { useEffect } from 'react'
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player'
import { useAppDispatch } from 'store/hooks'
import { Slider, Spinner, Text, XStack, YStack } from 'tamagui'

export default function PlayerStatus() {
  const { position, duration } = useProgress()
  const playbackState = usePlaybackState()
  const currentTrack = useActiveTrack()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (position > 0) {
      dispatch({
        type: 'feed/updatePosition',
        payload: {
          id: currentTrack?.id,
          position,
          duration,
        },
      })
    }
  }, [position, currentTrack?.url])

  if (playbackState.state === State.Loading || duration === 0) {
    return (
      <XStack id="player-status" ai="center" jc="center" width="100%" space={8}>
        <Spinner />
        <Text color="$color11">loading</Text>
      </XStack>
    )
  }

  return (
    <YStack id="player-status" width="100%" space={20}>
      <XStack w="100%" jc="space-between">
        <Text color="$color11" fontSize={12}>
          {formatStatusTime(position)}
        </Text>
        <Text color="$color11">-{formatStatusTime(duration - position)}</Text>
      </XStack>
      <Slider
        defaultValue={[0]}
        max={duration}
        step={1}
        mb={16}
        value={[position]}
        width="100%"
        orientation="horizontal"
        onValueChange={(value) => {
          try {
            if (value.length) {
              TrackPlayer.seekTo(value[0])
            }
          } catch (error) {}
        }}
      >
        <Slider.Track bc="$color8" height={30}>
          <Slider.TrackActive bc={MAIN_COLOR} />
        </Slider.Track>
        <Slider.Thumb index={0} circular elevate />
      </Slider>
    </YStack>
  )
}
