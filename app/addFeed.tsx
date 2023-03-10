import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Input, YStack, Button, Label } from 'tamagui'
import { Text, View } from '../components/Themed'
import { extract } from '../lib/parser'

export default function AddFeed() {
  const [url, setUrl] = useState('https://rsshub.app/wsj/en-us/opinion')

  useEffect(() => {
    extract('https://rsshub.app/wsj/en-us/opinion')
      .then((res) => {
        console.log('feed', res)
      })
      .catch(console.log)
  }, [])
  return (
    <View style={styles.container}>
      <YStack gap={16}>
        <YStack gap={4}>
          <Label size="$1.5">RSS Feed Address</Label>
          <Input
            size="$4"
            borderWidth={2}
            placeholder=""
            value={url}
            onChangeText={setUrl}
          />
        </YStack>
        <Button>Confirm</Button>
      </YStack>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
