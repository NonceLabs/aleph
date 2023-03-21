import { Observable } from 'lib/obserable'
import { useEffect, useState } from 'react'
import TrackPlayer, { Track, useActiveTrack } from 'react-native-track-player'
import { useAppDispatch } from 'store/hooks'

const queueStore = new Observable<Track[]>([])

export default function useQueue() {
  const [queue, setQueue] = useState<Track[]>(queueStore.get())

  const dispatch = useAppDispatch()
  const currentTrack = useActiveTrack()

  useEffect(() => {
    return queueStore.subscribe(setQueue)
  }, [])

  useEffect(() => {
    TrackPlayer.getQueue()
      .then((res) => {
        queueStore.set(res)
        dispatch({ type: 'feed/updatePlaylist', payload: res })
      })
      .catch((e) => {
        console.log('e', e)
      })
  }, [currentTrack?.id])

  return queue
}
