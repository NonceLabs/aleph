import { Image } from 'expo-image'
import usePlaylist from 'hooks/usePlaylist'
import { MAIN_COLOR } from 'lib/constants'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import {
  XStack,
  Text,
  Sheet,
  YStack,
  Slider,
  useWindowDimensions,
} from 'tamagui'
import PlayingEntry from './PlayingEntry'
import { BlurView } from 'expo-blur'
import useTheme from 'hooks/useTheme'
import { Link, useRouter } from 'expo-router'
import useFeed from 'hooks/useFeed'
import useEntry from 'hooks/useEntry'
import {
  Bookmark,
  ChevronLast,
  Info,
  ListMusic,
  PauseCircle,
  PlayCircle,
} from '@tamagui/lucide-icons'
import { useAppDispatch } from 'store/hooks'
import { PubEvent } from 'types'
import { AVPlaybackStatus } from 'expo-av'
import { formatStatusTime } from 'lib/helper'
import EntryList from './EntryList'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ClosedCaptions } from 'iconoir-react-native'
import SimpleEntryList from './SimpleEntryList'
import PlayerStatus from './PlayerStatus'

type ActiveButton = 'info' | 'caption' | 'list'

export default function PlayerPortal() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const [playStatus, setPlayStatus] = useState<AVPlaybackStatus>()
  const [active, setActive] = useState('info')
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { playing, isPlaying, sound, playlist } = usePlaylist()
  const { entry, onToggleBookmark } = useEntry(playing?.id)
  const feed = useFeed(playing?.feedUrl)
  const iconSize = 24

  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()

  useEffect(() => {
    const listener = PubSub.subscribe(PubEvent.ON_PODCAST_PORTAL, () => {
      setOpen(true)
    })

    return () => {
      listener && PubSub.unsubscribe(listener)
    }
  }, [])

  useEffect(() => {
    if (sound) {
      sound.setProgressUpdateIntervalAsync(1000)
      sound.setOnPlaybackStatusUpdate((status) => {
        setPlayStatus(status)

        if (status.isLoaded && status.isPlaying) {
          dispatch({
            type: 'feed/updatePlayingPosition',
            payload: status.positionMillis,
          })
        }
        if (status.isLoaded && status.didJustFinish) {
          dispatch({
            type: 'feed/playNext',
          })
        }
      })
    }
  }, [sound])

  if (!entry) {
    return null
  }

  const cover = entry?.cover || feed?.favicon

  return (
    <>
      {playing && (
        <PlayingEntry
          entry={playing}
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
              source={cover}
              placeholder={require('../assets/images/cover.png')}
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
                <SimpleEntryList entries={playlist} type="playlist" />
              </View>
            ) : (
              <YStack px={8} space={16} ai="center" jc="center" w="100%">
                <Image
                  source={cover}
                  placeholder={require('../assets/images/cover.png')}
                  style={{ width: 300, height: 300, borderRadius: 8 }}
                />
                <Text
                  fontFamily="Gilroy-Bold"
                  fontSize={18}
                  fontWeight="bold"
                  color="$color12"
                  ta="center"
                >
                  {playing?.title}
                </Text>
                <Link
                  href={`shared/feed?url=${encodeURIComponent(entry?.feedUrl)}`}
                  onPress={() => setOpen(false)}
                >
                  <Text
                    fontFamily="Gilroy-Bold"
                    fontSize={18}
                    fontWeight="bold"
                    color={MAIN_COLOR}
                    ta="center"
                  >
                    {feed?.title}
                  </Text>
                </Link>
              </YStack>
            )}
          </YStack>
          <YStack ai="center" jc="flex-end" space={16} px={8}>
            <YStack w="90%" ai="center" space={20}>
              <PlayerStatus
                status={playStatus}
                playing={playing}
                setPlayStatus={setPlayStatus}
                sound={sound}
              />

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
                  onPress={() => {
                    dispatch({
                      type: 'feed/play',
                      payload: playing,
                    })
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
                    dispatch({
                      type: 'feed/playNext',
                      payload: playing,
                    })
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
