import React from 'react'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { H3, XStack } from 'tamagui'

export default function Header({
  title,
  right,
}: {
  title: string
  right?: React.ReactNode
}) {
  const insets = useSafeAreaInsets()

  return (
    <XStack
      space
      style={{
        ...styles.container,
        paddingTop: insets.top,
      }}
    >
      <H3 style={{ color: 'black' }}>{title}</H3>
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
