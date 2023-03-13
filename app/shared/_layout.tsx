import { Slot } from 'expo-router'

export default function SharedLayout() {
  return (
    <Slot
      screenOptions={{
        headerShown: false,
        header: () => null,
      }}
    />
  )
}
