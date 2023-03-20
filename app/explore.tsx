import DrawerHeader from 'components/DrawerHeader'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { HOST } from 'lib/constants'
import { fetcher } from 'lib/request'
import _ from 'lodash'
import { useEffect } from 'react'
import { ScrollView } from 'react-native'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { YStack, Text, XStack } from 'tamagui'

export default function Explore() {
  const explore = useAppSelector((state) => state.feed.explore || [])
  const dispatch = useAppDispatch()
  useEffect(() => {
    fetcher(`${HOST}/explore`).then((res) => {
      dispatch({
        type: 'feed/setExplore',
        payload: res,
      })
    })
  }, [])

  return (
    <YStack flex={1}>
      <DrawerHeader title="Explore" />
      <ScrollView>
        {explore.map((item) => {
          return (
            <YStack key={item.title} px={4} py={8}>
              <Text fontWeight="bold" fontSize={24} color="$color12" mx={16}>
                {item.title}
              </Text>
              <ScrollView horizontal>
                {_.chunk(item.items, 3).map((chunk, idx) => {
                  return (
                    <YStack key={idx} space={16} px={4} py={8} mx={16} my={16}>
                      {chunk.map((item) => {
                        return (
                          <Link
                            key={item.title}
                            href={`shared/feed?url=${encodeURIComponent(
                              item.url
                            )}`}
                          >
                            <XStack space={8}>
                              <Image
                                source={item.favicon}
                                style={{
                                  width: 72,
                                  height: 72,
                                  borderRadius: 4,
                                }}
                              />
                              <YStack>
                                <Text
                                  fontSize={18}
                                  color="$color11"
                                  maxWidth={150}
                                  numberOfLines={3}
                                >
                                  {item.title}
                                </Text>
                              </YStack>
                            </XStack>
                          </Link>
                        )
                      })}
                    </YStack>
                  )
                })}
              </ScrollView>
            </YStack>
          )
        })}
      </ScrollView>
    </YStack>
  )
}
