import { Image } from 'expo-image'
import { MAIN_COLOR } from 'lib/constants'
import { useEffect, useState } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import { XStack, Text, Sheet, YStack, useWindowDimensions } from 'tamagui'
import PlayingTrack from './PlayingTrack'
import { BlurView } from 'expo-blur'
import useTheme from 'hooks/useTheme'
import { useRouter } from 'expo-router'
import { Info, ListMusic } from '@tamagui/lucide-icons'
import { PubEvent } from 'types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import PlayerController from './PlayerController'
import PlayList from './PlayList'
import {
  State,
  useActiveTrack,
  usePlaybackState,
} from 'react-native-track-player'
import icons from 'lib/icons'

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
  const playbackState = usePlaybackState()
  const currentTrack = useActiveTrack()

  const isPlaying = playbackState.state === State.Playing

  useEffect(() => {
    const listener = PubSub.subscribe(PubEvent.ON_PODCAST_PORTAL, () => {
      console.log('###ON_PODCAST_PORTAL')

      setOpen(true)
    })

    return () => {
      listener && PubSub.unsubscribe(listener)
    }
  }, [])

  if (!currentTrack) {
    return null
  }

  const onOpenChange = (open: boolean) => {
    console.log('###onOpenChange')

    setOpen(open)
    if (!open) {
      setActive('info')
    }
  }

  return (
    <>
      {currentTrack && (
        <PlayingTrack
          track={currentTrack}
          isPlaying={isPlaying}
          animate
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
        onOpenChange={onOpenChange}
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
          pb={
            insets.bottom + height * 0.1 + (Platform.OS === 'android' ? 20 : 0)
          }
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
                <PlayList
                  onPlay={() => setActive('info')}
                  currentTrack={currentTrack}
                />
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
                        id: encodeURIComponent(currentTrack.url),
                        type: 'podcast',
                        feedUrl: encodeURIComponent(currentTrack.feedUrl || ''),
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
            <PlayerController
              currentTrack={currentTrack}
              playbackState={playbackState}
            />

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
