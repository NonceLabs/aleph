import {
  Bookmark,
  ChevronLast,
  PauseCircle,
  PlayCircle,
  Slash,
} from '@tamagui/lucide-icons'
import useEntry from 'hooks/useEntry'
import { MAIN_COLOR } from 'lib/constants'
import { formatStatusTime } from 'lib/helper'
import Toast from 'lib/toast'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import TrackPlayer, {
  PlaybackState,
  State,
  Track,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { Slider, Spinner, Text, XStack, YStack } from 'tamagui'
import { PubEvent } from 'types'

export default function PlayerController({
  currentTrack,
  playbackState,
}: {
  currentTrack?: Track
  playbackState: PlaybackState | { state: undefined }
}) {
  const { position, duration } = useProgress()
  const dispatch = useAppDispatch()
  const queue = useAppSelector((state) => state.feed.playlist)
  const [handling, setHandling] = useState(false)

  const isPlaying = playbackState.state === State.Playing

  useEffect(() => {
    dispatch({
      type: 'feed/updatePosition',
      payload: {
        id: currentTrack?.id,
        position,
        duration,
        playing: playbackState.state,
      },
    })
  }, [position, currentTrack?.url, playbackState.state])

  let progress = null
  if (playbackState.state === State.Loading || duration === 0) {
    progress = (
      <XStack
        id="player-status"
        ai="center"
        jc="center"
        width="100%"
        space={8}
        h={60}
      >
        <Spinner />
        <Text color="$color11">loading</Text>
      </XStack>
    )
  } else {
    progress = (
      <YStack id="player-status" width="100%" space={20} h={60}>
        <XStack w="100%" jc="space-between">
          <Text color="$color11" fontSize={12}>
            {formatStatusTime(position)}
          </Text>
          <Text color="$color11" fontSize={12}>
            -{formatStatusTime(duration - position)}
          </Text>
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
          <Slider.Track bc="rgba(240, 53, 60, 0.4)" height={30}>
            <Slider.TrackActive bc={MAIN_COLOR} />
          </Slider.Track>
          <Slider.Thumb index={0} circular elevate />
        </Slider>
      </YStack>
    )
  }

  return (
    <YStack w="90%" ai="center" space={20}>
      {progress}

      <XStack ai="center" jc="center" space={32}>
        <Pressable
          onPress={async () => {
            try {
              setHandling(true)
              await TrackPlayer.pause()
              setTimeout(async () => {
                const activeIdx = await TrackPlayer.getActiveTrackIndex()
                if (typeof activeIdx === 'number') {
                  await TrackPlayer.remove(activeIdx)
                  await TrackPlayer.skipToNext()
                  PubSub.publish(PubEvent.TRACK_QUEUE_UPDATE)
                  Toast.success('Removed from play list')
                }
              }, 500)
              setHandling(false)
            } catch (error) {
              Toast.error(error)
              setHandling(false)
            }
          }}
        >
          <Slash size={30} color="$color11" opacity={handling ? 0.5 : 1} />
        </Pressable>
        <Pressable
          onPress={async () => {
            try {
              if (handling) {
                return
              }
              if (isPlaying) {
                await TrackPlayer.pause()
              } else {
                await TrackPlayer.play()
              }
            } catch (error) {
              Toast.error(error)
            }
          }}
        >
          {isPlaying ? (
            <PauseCircle size={50} color="$color12" />
          ) : (
            <PlayCircle size={50} color="$color12" />
          )}
        </Pressable>
        <Pressable
          onPress={async () => {
            try {
              const idx = await TrackPlayer.getActiveTrackIndex()
              if (typeof idx === 'number' && queue.length > 1) {
                const nextIdx = (idx + 1) % queue.length
                const nextTrack = queue[nextIdx]
                await TrackPlayer.skip(nextIdx, nextTrack?.position || 0)
              }
            } catch (error) {
              Toast.error(error)
            }
          }}
        >
          <ChevronLast size={30} color="$color11" />
        </Pressable>
      </XStack>
    </YStack>
  )
}
