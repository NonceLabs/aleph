import useTheme from 'hooks/useTheme'
import { FeedListType, Tag } from 'types'
import { BlurView } from 'expo-blur'
import { Animated, FlatList, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Text, XStack } from 'tamagui'
import { useRouter } from 'expo-router'
import { useMemo, useRef, useState } from 'react'
import { ArrowRightCircle } from '@tamagui/lucide-icons'

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
  type: FeedListType
}) {
  const listRef = useRef<FlatList>(null)
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const headerHeight = 38
  const [localTag, setLocalTag] = useState(selectedTag)

  const onSelectTag = (tag: Tag) => {
    if (tag.title === localTag?.title) {
      setSelectedTag(undefined)
      setLocalTag(undefined)
    } else {
      setSelectedTag(tag)
      setLocalTag(tag)
    }
  }

  const sorted = useMemo(() => {
    if (!localTag) {
      return tags
    } else {
      const idx = tags.findIndex((t) => t.title === localTag.title)
      const newTags = [...tags]
      newTags.splice(idx, 1)
      newTags.unshift(localTag)
      return newTags
    }
  }, [localTag, tags])

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
        <FlatList
          horizontal
          data={sorted}
          style={{
            paddingTop: 10,
            paddingBottom: 6,
            paddingHorizontal: 8,
          }}
          renderItem={({ item, index }) => {
            const active = localTag?.title === item.title
            const Icon = item.icon
            const contentColor = active
              ? 'white'
              : theme === 'dark'
              ? 'white'
              : 'black'
            return (
              <Button
                key={item.title}
                height={40}
                borderRadius={20}
                space={4}
                mx={4}
                icon={Icon ? <Icon size={24} color={contentColor} /> : null}
                onPress={() => onSelectTag(item)}
                themeInverse={active}
                bc={active ? '#f0353c' : '$blue5'}
              >
                <Text
                  fontSize={16}
                  fontFamily="Gilroy-Bold"
                  color={contentColor}
                >
                  {item.title}
                </Text>
                {item.count > 0 && (
                  <XStack backgroundColor="$gray7Light" px={8} py={2} br={16}>
                    <Text fontSize={14}>{item.count}</Text>
                  </XStack>
                )}
              </Button>
            )
          }}
          showsHorizontalScrollIndicator={false}
          ref={listRef}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          ListFooterComponent={
            type === 'flow' && tags.length > 3 ? (
              <XStack ai="center" jc="center" pt={4} ml={8} mr={16}>
                <Pressable onPress={() => router.push('tags')}>
                  <ArrowRightCircle width={32} height={32} color="$color11" />
                </Pressable>
              </XStack>
            ) : null
          }
        />
      </Animated.View>
    </AnimatedBlurView>
  )
}
