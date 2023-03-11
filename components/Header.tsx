import { useRouter } from 'expo-router'
import { NavArrowLeft } from 'iconoir-react-native'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { H2, XStack, Text } from 'tamagui'

export default function Header({
  title,
  right,
  back,
}: {
  title: string
  right?: React.ReactNode
  back?: boolean
}) {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <XStack
      space
      style={{
        ...styles.container,
        paddingTop: insets.top,
        paddingHorizontal: back ? 2 : 16,
      }}
    >
      {back ? (
        <Pressable onPress={() => router.back()}>
          <XStack alignItems="center">
            <NavArrowLeft width={32} height={32} />
            <Text fontSize={20}>{title}</Text>
          </XStack>
        </Pressable>
      ) : (
        <H2 style={{ color: 'black', fontFamily: 'Gilroy-Bold' }}>{title}</H2>
      )}

      {right}
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
