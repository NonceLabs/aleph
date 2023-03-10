import { Stack } from 'expo-router'

export default function FeedPages() {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ header: () => null }} />
    </Stack>
  )
}
