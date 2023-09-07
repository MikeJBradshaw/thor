import type { Reducer } from 'redux'

import {
  GUEST_BATH_BUTTON_CLICK,
  GUEST_BATH_BUTTON_HOLD,
  GUEST_BATH_BUTTON_RELEASE,
  GUEST_BATH_MOTION_SENSOR
} from 'actions/guestBath'
import {
  ROOM_STATE_DEFAULT,
  ROOM_STATE_DOUBLE
} from 'consts'
import type { GuestBathAction } from 'actions/guestBath'
import type { ButtonPayload, MotionSensorPayload } from 'payloads'

interface GuestBathState {
  overrideGuestBathLights: boolean
  overrideGuestBathMotionSensor: boolean
  motionSensorState: MotionSensorPayload
  buttonState: ButtonPayload
}

const initState: GuestBathState = {
  overrideGuestBathLights: false,
  overrideGuestBathMotionSensor: false,
  motionSensorState: {
    battery: -1,
    batteryLow: false,
    occupancy: false
  },
  buttonState: {
    action: '',
    battery: -1,
    linkquality: -1
  }
}

const guestBathReducer: Reducer<GuestBathState, GuestBathAction> = (state = initState, action) => {
  switch (action.type) {
    case GUEST_BATH_BUTTON_CLICK: {
      const oldAction = state.buttonState.action
      const buttonAction = action.payload.action

      // want to set default IFF we are currently not in default mode AND old and new actions agree
      if (oldAction !== ROOM_STATE_DEFAULT && oldAction === buttonAction) {
        return {
          ...state,
          overrideGuestBathMotionSensor: false,
          buttonState: {
            ...state.buttonState,
            ...action.payload,
            action: ROOM_STATE_DEFAULT
          }
        }
      }

      // double click not supported
      if (buttonAction === ROOM_STATE_DOUBLE) {
        return state
      }

      return {
        ...state,
        overrideGuestBathMotionSensor: true,
        buttonState: action.payload
      }
    }

    case GUEST_BATH_BUTTON_HOLD: {
      return { ...state, overrideGuestBathMotionSensor: true, buttonState: action.payload }
    }

    case GUEST_BATH_BUTTON_RELEASE: {
      return { ...state, overrideGuestBathMotionSensor: false, buttonState: action.payload }
    }

    case GUEST_BATH_MOTION_SENSOR: {
      return {
        ...state,
        motionSensorState: action.payload
      }
    }

    default:
      return state
  }
}

export default guestBathReducer
