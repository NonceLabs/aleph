import { Observable } from 'lib/obserable'
import { useState, useEffect } from 'react'

import TrackPlayer, {
  Track,
  useTrackPlayerEvents,
  Event,
  PlaybackQueueEndedEvent,
} from 'react-native-track-player'

const tracksStore = new Observable<{
  queue: Track[]
  currentTrack: Track | undefined
}>({
  queue: [],
  currentTrack: undefined,
})

export default function useTracks() {
  const [tracks, setTracks] = useState(tracksStore.get())

  useEffect(() => {
    return tracksStore.subscribe(setTracks)
  }, [])

  // Sets the initial index (if still undefined)
  useEffect(() => {
    let unmounted = false

    TrackPlayer.getQueue().then((queue) => {
      if (unmounted) return
      setTracks({
        ...tracks,
        queue,
      })

      TrackPlayer.getCurrentTrack()
        .then((trackIndex) => {
          if (unmounted) return
          if (typeof trackIndex !== 'number') {
            setTracks({
              ...tracks,
              currentTrack: queue[0] ?? undefined,
            })
          } else {
            TrackPlayer.getTrack(trackIndex ?? -1).then((_track) => {
              if (unmounted) return
              setTracks({
                ...tracks,
                currentTrack: _track ?? undefined,
              })
            })
          }
        })
        .catch(() => {
          // throws when you haven't yet setup, which is fine because it also
          // means there's no active track
        })
    })
    return () => {
      unmounted = true
    }
  }, [])

  useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
    if (typeof event.nextTrack === 'number') {
      TrackPlayer.getTrack(event.nextTrack)
        .then((track) => {
          setTracks({
            ...tracks,
            currentTrack: track ?? undefined,
          })
        })
        .catch((e) => {
          console.log('e', e)
        })
    } else if (typeof event.track === 'number') {
      TrackPlayer.getTrack(event.track)
        .then((track) => {
          setTracks({
            ...tracks,
            currentTrack: track ?? undefined,
          })
        })
        .catch((e) => {
          console.log('e', e)
        })
    }
  })

  useTrackPlayerEvents(
    [Event.PlaybackQueueEnded],
    (event: PlaybackQueueEndedEvent) => {}
  )

  return tracks
}
