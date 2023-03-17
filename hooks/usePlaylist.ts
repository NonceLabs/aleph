import { useEffect, useState } from 'react'
import { useAppSelector } from 'store/hooks'
import { Audio, AVPlaybackStatusSuccess } from 'expo-av'
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
        const { sound, status } = await Audio.Sound.createAsync(
          {
            uri: playing.media!,
          },
          {
            shouldPlay: true,
            positionMillis: playing.position || 0,
          }
        )
        if (status.isLoaded) {
          playerStore.set({
            sound,
            playing,
            status,
          })
        }
      } catch (error) {
        console.log('error', error)
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
