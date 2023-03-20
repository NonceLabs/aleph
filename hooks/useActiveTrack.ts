import { useState, useEffect } from 'react'

import TrackPlayer, {
  Track,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player'

export const useActiveTrack = (): Track | undefined => {
  const [track, setTrack] = useState<Track | undefined>()

  // Sets the initial index (if still undefined)
  useEffect(() => {
    let unmounted = false
    TrackPlayer.getCurrentTrack()
      .then((trackIndex) => {
        if (unmounted) return
        if (typeof trackIndex !== 'number') {
          TrackPlayer.getQueue().then((queue) => {
            if (unmounted) return

            setTrack(queue[0] ?? undefined)
          })
        } else {
          TrackPlayer.getTrack(trackIndex ?? -1).then((_track) => {
            if (unmounted) return
            setTrack(track ?? _track ?? undefined)
          })
        }
      })
      .catch(() => {
        // throws when you haven't yet setup, which is fine because it also
        // means there's no active track
      })
    return () => {
      unmounted = true
    }
  }, [])

  useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
    console.log('PlaybackTrackChanged track', event)

    if (typeof event.nextTrack === 'number') {
      TrackPlayer.getTrack(event.nextTrack)
        .then((track) => {
          setTrack(track ?? undefined)
        })
        .catch((e) => {
          console.log('e', e)
        })
    } else if (typeof event.track === 'number') {
      TrackPlayer.getTrack(event.track)
        .then((track) => {
          setTrack(track ?? undefined)
        })
        .catch((e) => {
          console.log('e', e)
        })
    }
  })

  return track
}
