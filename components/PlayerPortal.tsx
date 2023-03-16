import { Image } from 'expo-image'
import usePlaylist from 'hooks/usePlaylist'
import { BookmarkEmpty, InfoEmpty, PlaylistPlay } from 'iconoir-react-native'
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

export default function PlayerPortal() {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const theme = useTheme()
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
            <YStack space={16} ai="center" jc="center" px={30}>
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

            <XStack w="90%" my={20}>
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                width="100%"
                orientation="horizontal"
              >
                <Slider.Track bc="$color8">
                  <Slider.TrackActive bc={MAIN_COLOR} />
                </Slider.Track>
                <Slider.Thumb index={0} circular elevate />
              </Slider>
            </XStack>

            <XStack w="100%" ai="center" jc="space-around">
              <Link
                href={`shared/reader?id=${encodeURIComponent(entry.id)}`}
                onPress={() => setOpen(false)}
              >
                <InfoEmpty width={iconSize} height={iconSize} color="gray" />
              </Link>
              <Link href={`shared/playlist`} onPress={() => setOpen(false)}>
                <PlaylistPlay width={iconSize} height={iconSize} color="gray" />
              </Link>
              <Pressable
                onPress={() => {
                  onToggleBookmark({ ...entry, bookmarked: !entry.bookmarked })
                }}
              >
                <BookmarkEmpty
                  width={iconSize}
                  height={iconSize}
                  color={entry.bookmarked ? MAIN_COLOR : 'gray'}
                />
              </Pressable>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
