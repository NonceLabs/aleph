import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
} from 'react-native-track-player'
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

export const initQueue = async () => {}
