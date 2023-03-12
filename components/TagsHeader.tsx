import useTheme from 'hooks/useTheme'
import { Tag } from 'types'
import { BlurView } from 'expo-blur'
import { Animated, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, ScrollView, Text, XStack } from 'tamagui'
import { ArrowRightCircle } from 'iconoir-react-native'
import { useRouter } from 'expo-router'

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

export default function TagsHeader({
  tags,
  selectedTag,
  scrollY,
  setSelectedTag,
  type,
}: {
  tags: Tag[]
  selectedTag: Tag | undefined
  setSelectedTag: (tag: Tag | undefined) => void
  scrollY: Animated.Value
  type: 'flow' | 'bookmarks'
}) {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const headerHeight = 38
  return (
    <AnimatedBlurView
      intensity={scrollY.interpolate({
        inputRange: [
          0,
          headerHeight,
          headerHeight + insets.top,
          headerHeight + insets.top + 1,
        ],
        outputRange: [0, 0, 80, 80],
        extrapolate: 'clamp',
      })}
      tint={theme}
    >
      <Animated.View
        style={{
          paddingTop: scrollY.interpolate({
            inputRange: [
              0,
              headerHeight,
              headerHeight + insets.top,
              headerHeight + insets.top + 1,
            ],
            outputRange: [0, 0, insets.top, insets.top],
            extrapolate: 'clamp',
          }),
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack space={12} flex={1} px={8} alignItems="center" pt={10} pb={6}>
            {tags.map((t) => {
              const active = selectedTag?.title === t.title
              const Icon = t.icon
              const contentColor = active
                ? 'white'
                : theme === 'dark'
                ? 'white'
                : 'black'
              return (
                <Button
                  key={t.title}
                  height={40}
                  borderRadius="50%"
                  space={4}
                  icon={
                    Icon ? (
                      <Icon width={24} height={24} color={contentColor} />
                    ) : null
                  }
                  onPress={() => {
                    if (t.title === selectedTag?.title) {
                      setSelectedTag(undefined)
                    } else {
                      setSelectedTag(t)
                    }
                  }}
                  themeInverse={active}
                  bc={active ? '#f0353c' : '$blue3'}
                >
                  <Text
                    fontSize={16}
                    fontFamily="Gilroy-Bold"
                    color={contentColor}
                  >
                    {t.title}
                  </Text>
                  {t.count > 0 && (
                    <XStack backgroundColor="$gray7Light" px={8} py={2} br={16}>
                      <Text fontSize={14}>{t.count}</Text>
                    </XStack>
                  )}
                </Button>
              )
            })}
            {type === 'flow' && tags.length > 3 && (
              <Pressable onPress={() => router.push('tags')}>
                <ArrowRightCircle width={32} height={32} />
              </Pressable>
            )}
          </XStack>
        </ScrollView>
      </Animated.View>
    </AnimatedBlurView>
  )
}
