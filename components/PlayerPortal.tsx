import { Image } from 'expo-image'
import usePlaylist from 'hooks/usePlaylist'
import { MAIN_COLOR } from 'lib/constants'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { XStack, Text, Sheet, YStack, Slider } from 'tamagui'
import PlayingEntry from './PlayingEntry'
import { BlurView } from 'expo-blur'
import useTheme from 'hooks/useTheme'
import { Link } from 'expo-router'
import useFeed from 'hooks/useFeed'
import useEntry from 'hooks/useEntry'
import {
  Bookmark,
  ChevronFirst,
  ChevronLast,
  Info,
  ListMusic,
  PauseCircle,
  Play,
  PlayCircle,
} from '@tamagui/lucide-icons'
import { useAppDispatch } from 'store/hooks'

export default function PlayerPortal() {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { playing, isPlaying } = usePlaylist()
  const { entry, onToggleBookmark } = useEntry(playing?.id)
  const feed = useFeed(playing?.feedUrl)
  const iconSize = 32

  if (!entry) {
    return null
  }
  return (
    <>
      {playing && (
        <PlayingEntry
          entry={playing}
          isPlaying={isPlaying}
          animate
          withControl={false}
          size={40}
          onPress={() => setOpen(true)}
        />
      )}
      <Sheet
        forceRemoveScrollEnabled={open}
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame f={1} p="$4" space="$3">
          <View style={StyleSheet.absoluteFill}>
            <Image
              source={{
                uri: playing?.cover,
              }}
              contentFit="cover"
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <BlurView
            tint={theme}
            intensity={120}
            style={StyleSheet.absoluteFill}
          ></BlurView>
          <YStack ai="center" jc="center" space={32}>
            <YStack space={16} ai="center" jc="center" w="90%">
              <Image
                source={{ uri: playing?.cover }}
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

            <YStack w="90%" ai="center" space={20}>
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                mb={16}
                width="100%"
                orientation="horizontal"
              >
                <Slider.Track bc="$color8">
                  <Slider.TrackActive bc={MAIN_COLOR} />
                </Slider.Track>
                <Slider.Thumb index={0} circular elevate />
              </Slider>

              <XStack ai="center" jc="center" space={32}>
                <Pressable>
                  <ChevronFirst size={30} color="$color11" />
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
                <Pressable>
                  <ChevronLast size={30} color="$color11" />
                </Pressable>
              </XStack>
            </YStack>

            <XStack w="100%" ai="center" jc="space-around">
              <Link
                href={`shared/reader?id=${encodeURIComponent(entry.id)}`}
                onPress={() => setOpen(false)}
              >
                <Info width={iconSize} height={iconSize} color="$color11" />
              </Link>
              <Link href={`shared/playlist`} onPress={() => setOpen(false)}>
                <ListMusic
                  width={iconSize}
                  height={iconSize}
                  color="$color11"
                />
              </Link>
              <Pressable
                onPress={() => {
                  onToggleBookmark({ ...entry, bookmarked: !entry.bookmarked })
                }}
              >
                <Bookmark
                  width={iconSize}
                  height={iconSize}
                  color={entry.bookmarked ? MAIN_COLOR : '$color11'}
                />
              </Pressable>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
