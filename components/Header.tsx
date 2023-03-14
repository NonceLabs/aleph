import { useRouter } from 'expo-router'
import { NavArrowLeft } from 'iconoir-react-native'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { H2, XStack, Text } from 'tamagui'

export default function Header({
  title,
  center,
  right,
  back,
}: {
  title: string
  center?: React.ReactNode
  right?: React.ReactNode
  back?: boolean
}) {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const left = back ? (
    <Pressable onPress={() => router.back()}>
      <XStack alignItems="center">
        <NavArrowLeft width={32} height={32} />
        <Text fontSize={20} color="$color12">
          {title}
        </Text>
      </XStack>
    </Pressable>
  ) : (
    <H2 style={{ color: 'black', fontFamily: 'Gilroy-Bold' }}>{title}</H2>
  )
  const justifyContent = back || center ? 'space-between' : 'flex-start'
  return (
    <XStack
      space
      ac="center"
      justifyContent={justifyContent}
      style={{
        ...styles.container,
        paddingTop: insets.top,
        paddingLeft: back ? 2 : 16,
        paddingRight: back && right ? 8 : 16,
      }}
    >
      {left}
      {center}
      {right}

      {center && !right && <XStack o={0}>{left}</XStack>}
    </XStack>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
})
