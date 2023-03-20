import { MAIN_COLOR } from 'lib/constants'
import { formatStatusTime } from 'lib/helper'
import TrackPlayer, { useProgress } from 'react-native-track-player'
import { Slider, Text, XStack, YStack } from 'tamagui'

export default function PlayerStatus() {
  const { position, duration } = useProgress()
  if (duration === 0) {
    return null
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
