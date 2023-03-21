import { Image } from 'expo-image'
import { MAIN_COLOR } from 'lib/constants'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { XStack, Text, Sheet, YStack, useWindowDimensions } from 'tamagui'
import PlayingTrack from './PlayingTrack'
import { BlurView } from 'expo-blur'
import useTheme from 'hooks/useTheme'
import { useRouter } from 'expo-router'
import useEntry from 'hooks/useEntry'
import {
  Bookmark,
  ChevronLast,
  Info,
  ListMusic,
  PauseCircle,
  PlayCircle,
} from '@tamagui/lucide-icons'
import { PubEvent } from 'types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import PlayerStatus from './PlayerStatus'
import PlayList from './PlayList'
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player'
import icons from 'lib/icons'
import Toast from 'lib/toast'
import useTracks from 'hooks/useTracks'

type ActiveButton = 'info' | 'caption' | 'list'

export default function PlayerPortal() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const [active, setActive] = useState('info')
  const theme = useTheme()

  const iconSize = 24

  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const playerState = usePlaybackState()
  const { currentTrack } = useTracks()
  const { entry, onToggleBookmark } = useEntry(currentTrack?.id)

  const isPlaying = playerState === State.Playing

  useEffect(() => {
    const listener = PubSub.subscribe(PubEvent.ON_PODCAST_PORTAL, () => {
      setOpen(true)
    })

    return () => {
      listener && PubSub.unsubscribe(listener)
    }
  }, [])

  if (!entry || !currentTrack) {
    return null
  }

  return (
    <>
      {currentTrack && (
        <PlayingTrack
          track={currentTrack}
          isPlaying={isPlaying}
          animate
          withControl={false}
          size={40}
          onPress={() => {
            setOpen(true)
          }}
        />
      )}
      <Sheet
        forceRemoveScrollEnabled={open}
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[90]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame
          f={1}
          space="$3"
          jc="flex-end"
          pb={insets.bottom + height * 0.1}
        >
          <View style={StyleSheet.absoluteFill}>
            <Image
              source={currentTrack?.artwork}
              placeholder={icons.DEFAULT_COVER}
              contentFit="cover"
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <BlurView
            tint={theme}
            intensity={120}
            style={StyleSheet.absoluteFill}
          ></BlurView>
          <YStack flex={1} ai="center" jc="center">
            {active === 'list' ? (
              <View style={{ height: '100%', width: '100%' }}>
                <PlayList />
              </View>
            ) : (
              <YStack px={8} space={16} ai="center" jc="center" w="100%">
                <Image
                  source={currentTrack?.artwork}
                  placeholder={icons.DEFAULT_COVER}
                  style={{ width: 300, height: 300, borderRadius: 8 }}
                />
                <Text
                  fontFamily="Gilroy-Bold"
                  fontSize={18}
                  fontWeight="bold"
                  color="$color12"
                  ta="center"
                  onPress={() => {
                    router.push({
                      pathname: 'shared/reader',
                      params: {
                        id: encodeURIComponent(entry.id),
                        type: 'podcast',
                        feedUrl: encodeURIComponent(entry.feedUrl || ''),
                      },
                    })
                    setOpen(false)
                  }}
                >
                  {currentTrack?.title}
                </Text>
                <Text
                  fontFamily="Gilroy-Bold"
                  fontSize={18}
                  fontWeight="bold"
                  color={MAIN_COLOR}
                  ta="center"
                >
                  {currentTrack?.artist}
                </Text>
              </YStack>
            )}
          </YStack>
          <YStack ai="center" jc="flex-end" space={16} px={8}>
            <YStack w="90%" ai="center" space={20}>
              <PlayerStatus />

              <XStack ai="center" jc="center" space={32}>
                <Pressable
                  onPress={() => {
                    onToggleBookmark({
                      ...entry,
                      bookmarked: !entry.bookmarked,
                    })
                  }}
                >
                  <Bookmark
                    size={30}
                    color={entry.bookmarked ? MAIN_COLOR : '$color11'}
                  />
                </Pressable>
                <Pressable
                  onPress={async () => {
                    try {
                      console.log('isPlaying', isPlaying)

                      if (isPlaying) {
                        await TrackPlayer.pause()
                      } else {
                        await TrackPlayer.play()
                      }
                    } catch (error) {
                      console.log('error', error)

                      Toast.error(error)
                    }
                  }}
                >
                  {isPlaying ? (
                    <PauseCircle size={50} color="$color12" />
                  ) : (
                    <PlayCircle size={50} color="$color12" />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    TrackPlayer.skipToNext()
                  }}
                >
                  <ChevronLast size={30} color="$color11" />
                </Pressable>
              </XStack>
            </YStack>

            <XStack w="90%" ai="center" jc="space-between">
              {[
                {
                  icon: Info,
                  type: 'info',
                },
                // {
                //   icon: ClosedCaptions,
                //   type: 'caption',
                // },
                {
                  icon: ListMusic,
                  type: 'list',
                },
              ].map((t) => {
                const Icon = t.icon
                return (
                  <Pressable
                    key={t.type}
                    onPress={() => setActive(t.type)}
                    style={
                      active === t.type
                        ? {
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            borderRadius: 4,
                            padding: 8,
                          }
                        : { padding: 8 }
                    }
                  >
                    <Icon size={iconSize} color="$color11" />
                  </Pressable>
                )
              })}
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
