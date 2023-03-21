import _ from 'lodash'
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Track,
} from 'react-native-track-player'
import { store } from 'store'
import icons from './icons'

export const setupPlayerService = async (): Promise<boolean> => {
  let isSetup = false
  try {
    // this method will only reject if player has not been setup yet
    await TrackPlayer.getActiveTrackIndex()
    isSetup = true
  } catch {
    console.log('TrackPlayer not setup yet')

    await TrackPlayer.setupPlayer()
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 1,
      icon: icons.LOGO,
    })
    await TrackPlayer.setRepeatMode(RepeatMode.Queue)
    isSetup = true
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return isSetup
  }
}

export const initQueue = async () => {
  try {
    const playlist: Track[] = _.uniqBy(
      store.getState().feed.playlist || [],
      'id'
    ).map((t) => {
      return {
        ...t,
        position: t.position || 0,
        playing: t.playing || false,
        duration: t.duration ? t.duration : undefined,
      }
    })

    await TrackPlayer.add(playlist)
    // let playingItem: Track
    // let playingIdx = -1
    await Promise.all(
      playlist.map(async (t, idx) => {
        await TrackPlayer.skip(idx, t.position)
        if (t.playing) {
          // playingItem = t
          // playingIdx = idx
        }
      })
    )
  } catch (error) {}
}
