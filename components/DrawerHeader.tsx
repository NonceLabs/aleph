import { useNavigation } from 'expo-router'
import { Menu } from 'iconoir-react-native'
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
  return (
    <XStack pt={insets.top} px={16} ai="center" jc="space-between">
      <XStack ai="center" space={8}>
        <Pressable
          onPress={() => {
            // @ts-ignore
            navigation.openDrawer()
          }}
        >
          <Menu width={24} height={24} color="#f0353c" />
        </Pressable>
        <Text fontFamily="Gilroy-Bold" fontSize={24} color={MAIN_COLOR}>
          {title}
        </Text>
      </XStack>
      {right}
    </XStack>
  )
}
