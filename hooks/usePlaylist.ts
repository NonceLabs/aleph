import { useEffect, useState } from 'react'
import { useAppSelector } from 'store/hooks'
import { Audio } from 'expo-av'
import { Observable } from 'lib/obserable'
import { FeedEntry } from 'types'

const soundStore = new Observable<{
  sound: Audio.Sound | null
  playing?: FeedEntry
}>({
  sound: null,
  playing: undefined,
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
        }
      )
        .then(({ sound, status }) => {
          soundStore.set({
            sound,
            playing,
          })
          sound.playAsync()
        })
        .catch((error) => {})
    } else if (!isPlaying && sound) {
      sound.sound?.stopAsync()
    }
  }, [playing, isPlaying])

  return {
    playlist,
    isPlaying,
    playing: playlist ? playlist[0] : undefined,
  }
}
