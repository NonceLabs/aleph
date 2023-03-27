import { CupSoda, X } from '@tamagui/lucide-icons'
import { useState } from 'react'
import {
  Unspaced,
  Dialog,
  Button,
  YStack,
  Input,
  useWindowDimensions,
  XStack,
  Text,
} from 'tamagui'
import { MAIN_COLOR } from 'lib/constants'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Toast from 'lib/toast'
import { fetcher } from 'lib/request'
import { Alert, Platform } from 'react-native'
import Purchases from 'react-native-purchases'

export default function MyAPIKey() {
  const { apiKey: _apiKey } = useAppSelector((state) => state.setting.openAPI)
  const purchased = useAppSelector((state) => state.setting.purchased)
  const [apiKey, setApiKey] = useState(_apiKey)
  const [open, setOpen] = useState(false)
  const { width } = useWindowDimensions()

  const dispatch = useAppDispatch()
  const onConfirm = async () => {
    if (!apiKey) {
      return Toast.error('Invalid API Key')
    }
    try {
      const result = await fetcher(`https://api.openai.com/v1/models`, {
        Authorization: `Bearer ${apiKey}`,
      })
      if (result.error) {
        return Toast.error(result.error.message)
      }
      dispatch({
        type: 'setting/updateApiKey',
        payload: apiKey,
      })
      Toast.success("API Key added! You're good to go!")
    } catch (error) {
      Toast.error(error)
    }
  }

  const onDelete = () => {
    Alert.alert('Warning', 'By pressing confirm, you delete the API key.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: () => {
          dispatch({
            type: 'setting/updateApiKey',
            payload: '',
          })
        },
      },
    ])
  }

  const onPurchase = async () => {
    try {
      if (Platform.OS === 'ios') {
        Purchases.configure({ apiKey: 'appl_WhGheBhuxObFAEBibQsjRTJKcQx' })
      } else if (Platform.OS === 'android') {
        Purchases.configure({ apiKey: '' })
      }
      const offerings = await Purchases.getOfferings()
      console.log('offerings', offerings)
    } catch (error) {
      console.log('error', error)

      Toast.error(error)
    }
  }

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      {!_apiKey ? (
        purchased ? (
          <Button bc="$red9" color="white" onPress={() => setOpen(true)}>
            Enter API Key
          </Button>
        ) : (
          <Button
            bc={MAIN_COLOR}
            color="white"
            icon={CupSoda}
            scaleIcon={1.6}
            onPress={onPurchase}
          >
            Upgrade to Aleph Pro
          </Button>
        )
      ) : (
        <YStack space={8}>
          <Text fontWeight="bold" fontSize={18} color="$color11">
            My API Key
          </Text>
          <Text
            color="$color11"
            numberOfLines={1}
            ellipse
            ellipsizeMode="middle"
            fontFamily="Arvo"
          >
            {apiKey}
          </Text>
          <XStack space={16}>
            <Button f={1} bc="$gray10" color="white" onPress={onDelete}>
              Delete
            </Button>
            <Button
              f={1}
              bc="$red9"
              color="white"
              onPress={() => setOpen(true)}
            >
              Edit
            </Button>
          </XStack>
        </YStack>
      )}
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          o={0.7}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
          backgroundColor="black"
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          space="$1"
          w={width - 40}
        >
          <YStack space={5}>
            <Dialog.Title size="$5" lineHeight="$1">
              Your API Key
            </Dialog.Title>
            <Dialog.Description size="$2"></Dialog.Description>
            <Input
              size="$4"
              borderWidth={2}
              placeholder=""
              value={apiKey}
              onChangeText={setApiKey}
              textContentType="URL"
            />
            <Dialog.Close asChild>
              <Button
                bc={MAIN_COLOR}
                color="white"
                style={{ marginTop: 16 }}
                onPress={onConfirm}
              >
                Confirm
              </Button>
            </Dialog.Close>
          </YStack>
          <Unspaced>
            <Dialog.Close asChild>
              <Button
                pos="absolute"
                t="$3"
                r="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
