import { Menu } from '@tamagui/lucide-icons'
import { BlurView } from 'expo-blur'
import { useNavigation } from 'expo-router'
import useTheme from 'hooks/useTheme'
import { MAIN_COLOR } from 'lib/constants'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text, XStack } from 'tamagui'

export default function DrawerHeader({
  title,
  right,
}: {
  title: string
  right?: React.ReactNode
}) {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const theme = useTheme()
  return (
    <BlurView intensity={80} tint={theme}>
      <XStack
        pt={insets.top}
        pl={8}
        pr={4}
        pb={8}
        ai="center"
        jc="space-between"
      >
        <XStack ai="center" space={8}>
          <Pressable
            onPress={() => {
              // @ts-ignore
              navigation.openDrawer()
            }}
          >
            <Menu width={28} height={28} color="#f0353c" />
          </Pressable>
          <Text fontFamily="Gilroy-Bold" fontSize={24} color={MAIN_COLOR}>
            {title}
          </Text>
        </XStack>
        {right}
      </XStack>
    </BlurView>
  )
}
