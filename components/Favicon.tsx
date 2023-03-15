import { StyleSheet } from 'react-native'
import { Image } from 'expo-image'

export default function Favicon({
  favicon,
  size = 24,
  placeholder,
}: {
  favicon?: string
  size?: number
  placeholder?: boolean
}) {
  if (!favicon && !placeholder) {
    return null
  }

  return (
    <Image
      source={favicon}
      placeholder={require('../assets/images/rss.png')}
      contentFit="cover"
      placeholderContentFit="cover"
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#999',
      }}
    />
  )
}
