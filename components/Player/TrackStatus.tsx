import { PauseCircle, PlayCircle } from '@tamagui/lucide-icons'
import { State } from 'react-native-track-player'
import { Spinner, XStack } from 'tamagui'

export default function TrackStatus({
  state,
  queued,
  size = 40,
}: {
  state?: State
  queued: boolean
  size?: number
}) {
  if (queued) {
    if (state === State.Playing) {
      return <PauseCircle size={size} color="white" />
    }
    if (state === State.Buffering) {
      return (
        <XStack width={size} height={size} ai="center" jc="center">
          <Spinner size={size > 30 ? 'large' : 'small'} color="white" />
        </XStack>
      )
    }
  }
  return <PlayCircle size={size} color="white" />
}
