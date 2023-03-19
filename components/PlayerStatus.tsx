import { Audio, AVPlaybackStatus } from 'expo-av'
import { MAIN_COLOR } from 'lib/constants'
import { formatStatusTime } from 'lib/helper'
import { Slider, Text, XStack, YStack } from 'tamagui'
import { PlayingFeedEntry } from 'types'

export default function PlayerStatus({
  status,
  playing,
  setPlayStatus,
  sound,
}: {
  status?: AVPlaybackStatus
  playing?: PlayingFeedEntry
  setPlayStatus: (status: AVPlaybackStatus) => void
  sound: Audio.Sound | null
}) {
  let duration = 0
  let position = 0

  if (!playing || !status || !sound) {
    return null
  }
  if (!status.isLoaded) {
    if (!playing.duration) {
      return null
    } else {
      duration = playing.duration || 0
      position = playing.position || 0
    }
  } else {
    duration = playing.duration || status.durationMillis || 0
    position = playing.position || status.positionMillis || 0
  }

  console.log('status', duration, position)

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
        step={1000}
        mb={16}
        value={[position]}
        width="100%"
        orientation="horizontal"
        onValueChange={(value) => {
          try {
            if (value.length > 0 && status.isLoaded) {
              setPlayStatus({
                ...status,
                positionMillis: value[0],
              })
              sound?.playFromPositionAsync(value[0])
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
