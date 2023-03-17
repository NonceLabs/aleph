import { useEffect, useState } from 'react'
import { useAppSelector } from 'store/hooks'
import { Audio, AVPlaybackStatusSuccess } from 'expo-av'
import { Observable } from 'lib/obserable'
import { FeedEntry } from 'types'

const soundStore = new Observable<{
  sound: Audio.Sound | null
  playing?: FeedEntry
  status?: AVPlaybackStatusSuccess
}>({
  sound: null,
  playing: undefined,
  status: undefined,
})
export default function usePlaylist() {
  const [sound, setSound] = useState(soundStore.get())
  const { isPlaying, playing, playlist } = useAppSelector((state) => state.feed)

  useEffect(() => {
    return soundStore.subscribe(setSound)
  }, [])

  useEffect(() => {
    if (isPlaying && playing) {
      if (playing.id !== sound.playing?.id) {
        sound.sound?.stopAsync()
      }
      Audio.Sound.createAsync(
        {
          uri: playing.media!,
        },
        {
          shouldPlay: true,
          positionMillis: playing.position || 0,
        }
      )
        .then(({ sound, status }) => {
          if (status.isLoaded) {
            soundStore.set({
              sound,
              playing,
              status,
            })
            // sound.playFromPositionAsync()
          }
        })
        .catch((error) => {})
    } else if (!isPlaying && sound) {
      sound.sound?.stopAsync()
    }
  }, [playing?.id, isPlaying])

  return {
    playlist,
    isPlaying,
    playing,
    status: sound.status,
    sound: sound.sound,
  }
}
