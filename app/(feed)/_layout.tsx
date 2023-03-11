import { Stack } from 'expo-router'

export default function FeedPages() {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ header: () => null }} />
      <Stack.Screen
        name="article"
        options={{
          headerShown: false,
          header: () => null,
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}
