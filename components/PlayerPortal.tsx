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

export default function PlayerPortal() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const [playStatus, setPlayStatus] = useState<AVPlaybackStatus>()
  const [showList, setShowList] = useState(false)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { playing, isPlaying, sound, playlist } = usePlaylist()
  const { entry, onToggleBookmark } = useEntry(playing?.id)
  const feed = useFeed(playing?.feedUrl)
  const iconSize = 32

  const router = useRouter()
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
        // console.log('status', status)

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
            {showList ? (
              <View style={{ height: '100%', width: '100%' }}>
                <EntryList
                  entries={playlist}
                  type="bookmarks"
                  withHeader={false}
                />
              </View>
            ) : (
              <YStack px={8} space={16} ai="center" jc="center" w="100%">
                <Image
                  source={cover}
                  placeholder={require('../assets/images/cover.png')}
                  style={{ width: 200, height: 200, borderRadius: 8 }}
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
              {playStatus?.isLoaded && (
                <XStack w="100%" jc="space-between">
                  <Text color="$color11" fontSize={12}>
                    {formatStatusTime(
                      playStatus.isPlaying
                        ? playStatus.positionMillis
                        : playing?.position
                    )}
                  </Text>
                  <Text color="$color11">
                    -
                    {formatStatusTime(
                      (playStatus?.durationMillis || 0) -
                        (playStatus.isPlaying
                          ? playStatus.positionMillis
                          : playing?.position || 0)
                    )}
                  </Text>
                </XStack>
              )}
              {playStatus?.isLoaded && (
                <Slider
                  defaultValue={[0]}
                  max={playStatus.durationMillis || 1000 * 60 * 60}
                  step={1000}
                  mb={16}
                  value={[
                    playStatus.isPlaying
                      ? playStatus.positionMillis
                      : playing?.position || 0,
                  ]}
                  width="100%"
                  orientation="horizontal"
                  onValueChange={(value) => {
                    try {
                      if (value.length > 0) {
                        setPlayStatus({
                          ...playStatus,
                          positionMillis: value[0],
                        })
                        sound?.playFromPositionAsync(value[0])
                      }
                    } catch (error) {}
                  }}
                >
                  <Slider.Track bc="$color8">
                    <Slider.TrackActive bc={MAIN_COLOR} />
                  </Slider.Track>
                  <Slider.Thumb index={0} circular elevate />
                </Slider>
              )}

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
              <Link
                href={`shared/reader?id=${encodeURIComponent(entry.id)}`}
                onPress={() => setOpen(false)}
                style={{ padding: 4 }}
              >
                <Info size={iconSize} color="$color11" />
              </Link>
              <ClosedCaptions width={iconSize} height={iconSize} />
              <Pressable
                onPress={() => setShowList(!showList)}
                style={
                  showList
                    ? {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: 4,
                        padding: 4,
                      }
                    : { padding: 4 }
                }
              >
                <ListMusic size={iconSize} color="$color11" />
              </Pressable>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
