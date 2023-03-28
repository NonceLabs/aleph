import { CupSoda, X } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import {
  Unspaced,
  Dialog,
  Button,
  YStack,
  Input,
  useWindowDimensions,
  XStack,
  Text,
  Spinner,
} from 'tamagui'
import { MAIN_COLOR } from 'lib/constants'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Toast from 'lib/toast'
import { fetcher } from 'lib/request'
import { Alert, Platform } from 'react-native'
import Purchases, { PurchasesPackage } from 'react-native-purchases'

export default function MyAPIKey() {
  const { apiKey: _apiKey } = useAppSelector((state) => state.setting.openAI)
  const purchased = useAppSelector((state) => state.setting.purchased)
  const [apiKey, setApiKey] = useState(_apiKey)
  const [open, setOpen] = useState(false)
  const [handling, setHandling] = useState(false)
  const [purchasePackage, setPurchasePackage] =
    useState<PurchasesPackage | null>(null)
  const { width } = useWindowDimensions()

  const dispatch = useAppDispatch()

  useEffect(() => {
    async function fetchOffering() {
      try {
        if (Platform.OS === 'ios') {
          Purchases.configure({ apiKey: 'appl_WhGheBhuxObFAEBibQsjRTJKcQx' })
        } else if (Platform.OS === 'android') {
          Purchases.configure({ apiKey: '' })
        }
        const offerings = await Purchases.getOfferings()
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          setPurchasePackage(offerings.current.availablePackages[0])
        }
      } catch (error) {
        console.log('error', error)

        Toast.error(error)
      }
    }
    fetchOffering()
    // dispatch({
    //   type: 'setting/purchased',
    //   payload: false,
    // })
  }, [])

  const onConfirm = async () => {
    if (!apiKey) {
      return Toast.error('Invalid API Key')
    }
    try {
      setHandling(true)
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
      setHandling(false)
      Toast.success("API Key added! You're good to go!")
    } catch (error) {
      setHandling(false)
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
      if (!purchasePackage) {
        return Toast.error('Purchase package not found')
      }
      setHandling(true)
      const { customerInfo } = await Purchases.purchasePackage(purchasePackage)

      if (typeof customerInfo.entitlements.active.AlephPro !== 'undefined') {
        dispatch({
          type: 'setting/purchased',
          payload: true,
        })
        Toast.success('Thanks for your purchase!')
      }
      setHandling(false)
    } catch (error) {
      setHandling(false)
      if (!(error as any).userCancelled) {
        Toast.error(error)
      }
    }
  }

  const onRestore = async () => {
    try {
      setHandling(true)
      const customerInfo = await Purchases.restorePurchases()
      if (typeof customerInfo.entitlements.active.AlephPro !== 'undefined') {
        dispatch({
          type: 'setting/purchased',
          payload: true,
        })
        Toast.success('Thanks for your purchase!')
      }
      setHandling(false)
    } catch (error) {
      setHandling(false)
      Toast.error(error)
    }
  }

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      {purchased ? (
        !_apiKey ? (
          <Button
            bc="$red9"
            color="white"
            disabled={handling}
            onPress={() => setOpen(true)}
            pressStyle={{ backgroundColor: '$red7' }}
          >
            {handling ? <Spinner color="white" /> : 'Enter API Key'}
          </Button>
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
                pressStyle={{ backgroundColor: '$red7' }}
              >
                Edit
              </Button>
            </XStack>
          </YStack>
        )
      ) : (
        <Button
          bc="$red9"
          color="white"
          icon={CupSoda}
          scaleIcon={1.6}
          onPress={onPurchase}
          disabled={handling}
          pressStyle={{ backgroundColor: '$red7' }}
        >
          {handling ? (
            <Spinner color="white" />
          ) : (
            [
              <Text key="text" color="white">
                Upgrade to Aleph Pro
              </Text>,
              <Text key="price" fontSize={18} color="white" fontWeight="bold">
                {purchasePackage?.product.priceString}
              </Text>,
            ]
          )}
        </Button>
      )}
      {!purchased && (
        <YStack ai="center" mt={8}>
          <Text color="$color10">or</Text>
          <Button onPress={onRestore} disabled={handling}>
            Restore Your Purchase
          </Button>
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
