import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  Audio,
  AVPlaybackStatusSuccess,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from 'expo-av'
import { Observable } from 'lib/obserable'
import { FeedEntry } from 'types'

const playerStore = new Observable<{
  sound: Audio.Sound | null
  playing?: FeedEntry
  status?: AVPlaybackStatusSuccess
}>({
  sound: null,
  playing: undefined,
  status: undefined,
})

// TODO
// - [ ] FIX playing queue

export default function usePlaylist() {
  const [player, setPlayer] = useState(playerStore.get())
  const { isPlaying, playing, playlist } = useAppSelector((state) => state.feed)
  const dispatch = useAppDispatch()

  useEffect(() => {
    return playerStore.subscribe(setPlayer)
  }, [])

  useEffect(() => {
    async function handlePlay() {
      if (!playing) {
        return
      }
      try {
        if (playing.id !== player.playing?.id) {
          await player.sound?.stopAsync()
          await player.sound?.unloadAsync()
        }
        Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
        })
          .then(() => {
            console.log('setAudioModeAsync')
          })
          .catch((e) => {
            console.log('setAudioModeAsync error', e.code)
          })
        const { sound, status } = await Audio.Sound.createAsync(
          {
            uri: playing.media!,
          },
          {
            shouldPlay: true,
            positionMillis: playing.position || 0,
            volume: 1,
          }
        )

        if (isPlaying) {
          if (status.isLoaded) {
            playerStore.set({
              sound,
              playing,
              status,
            })
            dispatch({
              type: 'feed/updatePlayingDuration',
              payload: status.durationMillis,
            })
          }
        } else {
          sound.stopAsync()
        }
      } catch (error) {
        console.log('error', (error as any).code)
      }
    }
    if (isPlaying && playing) {
      handlePlay()
    } else if (!isPlaying && player) {
      player.sound?.stopAsync()
    }
  }, [playing?.id, isPlaying])

  return {
    playlist,
    isPlaying,
    playing,
    status: player.status,
    sound: player.sound,
  }
}
