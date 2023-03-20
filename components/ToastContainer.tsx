import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  ImageSourcePropType,
  useWindowDimensions,
} from 'react-native'
import { Image } from 'expo-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PubEvent, ToastPayload, ToastType } from 'types'
import { Text, XStack } from 'tamagui'

const BG_COLORS = {
  error: '#FF4040',
  success: '#00C781',
  info: '#3D138D',
  warning: '#FFCA58',
}

export default function ToastContainer() {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const [message, setMessage] = useState('')
  const [type, setType] = useState<ToastType>('info')
  const [icon, setIcon] = useState<ImageSourcePropType>()
  const phPosY = useRef(new Animated.Value(-100)).current

  useEffect(() => {
    const onClose = () => {
      Animated.parallel([
        Animated.timing(phPosY, {
          toValue: -100,
          duration: 200,
          easing: Easing.poly(1),
          useNativeDriver: true,
        }),
      ]).start()
      setTimeout(() => {
        setMessage('')
        setIcon(undefined)
      }, 200)
    }

    const onMessage = (
      msg: string,
      { type, message, duration, icon }: ToastPayload
    ) => {
      setType(type)
      setMessage(message)
      setIcon(icon)
      Animated.parallel([
        Animated.timing(phPosY, {
          toValue: 0,
          duration: 200,
          easing: Easing.poly(1),
          useNativeDriver: true,
        }),
      ]).start()

      setTimeout(onClose, duration)
    }
    const onMessageTick = PubSub.subscribe(PubEvent.TOAST_MESSAGE, onMessage)
    const onHideTick = PubSub.subscribe(PubEvent.TOAST_HIDE, onClose)
    return () => {
      onMessageTick && PubSub.unsubscribe(onMessageTick)
      onHideTick && PubSub.unsubscribe(onHideTick)
    }
  }, [])

  if (!message) {
    return null
  }

  return (
    <Animated.View
      style={{
        paddingTop: insets.top,
        paddingBottom: 10,
        backgroundColor: BG_COLORS[type],
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        zIndex: 10000,
        transform: [
          {
            translateY: phPosY,
          },
        ],
      }}
    >
      <XStack ai="center" jc="center" style={{ paddingHorizontal: 20 }}>
        {icon && (
          <Image
            source={icon}
            style={{ width: 30, height: 30, marginRight: 10, borderRadius: 4 }}
            contentFit="cover"
          />
        )}
        <Text fontSize={18} ta="center" color="white">
          {message}
        </Text>
      </XStack>
    </Animated.View>
  )
}
