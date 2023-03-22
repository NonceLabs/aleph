import { createToast, Toast } from 'tamagui'

export const { ImperativeToastProvider, useToast } = createToast()

export const CurrentToast = () => {
  const { currentToast } = useToast()

  if (!currentToast) return null

  return (
    <Toast key={currentToast.id}>
      <Toast.Title>{currentToast.title}</Toast.Title>
      {currentToast.message && (
        <Toast.Description>{currentToast.message}</Toast.Description>
      )}
    </Toast>
  )
}
