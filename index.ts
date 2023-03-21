import 'expo-router/entry'
import TrackPlayer from 'react-native-track-player'
import { PlaybackService } from './lib/playbackService'
TrackPlayer.registerPlaybackService(() => PlaybackService)
