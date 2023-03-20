import * as PubSub from 'pubsub-js'
import { ImageSourcePropType } from 'react-native'
import { PubEvent, ToastType } from 'types'

const DURATION = 1800

const toast = (
  type: ToastType,
  message: string,
  duration: number,
  icon: ImageSourcePropType | undefined
) => {
  PubSub.publish(PubEvent.TOAST_MESSAGE, {
    type,
    message,
    duration,
    icon,
  })
}

export default class Toast {
  static error(error: unknown, icon = undefined, duration = DURATION * 2) {
    if (error instanceof Error) {
      toast('error', error.message, duration, icon)
      console.log('🐞', error.message)
    } else if (typeof error === 'string') {
      toast('error', error, duration, icon)
    }
  }

  static success(message: string, icon = undefined, duration = DURATION) {
    toast('success', message, duration, icon)
  }

  static info(message: string, icon = undefined, duration = DURATION) {
    toast('info', message, duration, icon)
  }

  static warning(message: string, icon = undefined, duration = DURATION) {
    toast('warning', message, duration, icon)
  }

  static close() {
    PubSub.publish(PUB.TOAST_HIDE)
  }
}
