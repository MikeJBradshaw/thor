import type { Reducer } from 'redux'

import { LIVING_ROOM_BUTTON_CLICK, UPDATE_PROFILE_DEFAULT, UPDATE_PROFILE_RAINBOW } from 'actions/livingRoom'
import { BRIGHTNESS_LOW, BRIGHTNESS_HIGH, BRIGHTNESS_OFF } from 'consts'
import type { LivingRoomAction } from 'actions/livingRoom'
import type { ButtonPayload } from 'types/payloads'

export interface LivingRoomState {
  isProfileDefault: boolean
  isProfileRainbow: boolean
  overrideLivingRoomLights: boolean
  lightPower: number
  buttonState: ButtonPayload
}

const initState: LivingRoomState = {
  isProfileDefault: true,
  isProfileRainbow: false,
  overrideLivingRoomLights: false,
  lightPower: BRIGHTNESS_OFF,
  buttonState: {
    action: '',
    battery: -1,
    linkquality: -1
  }
}

const livingRoomReducer: Reducer<LivingRoomState, LivingRoomAction> = (state = initState, action) => { // eslint-disable-line
  switch (action.type) {
    case LIVING_ROOM_BUTTON_CLICK: {
      if (action.payload.action === 'hold') {
        if (state.isProfileDefault) {
          return {
            ...state,
            isProfileRainbow: true,
            isProfileDefault: false
          }
        }

        return {
          ...state,
          isProfileRainbow: false,
          isProfileDefault: true
        }
      }

      if (state.isProfileDefault) {
        if (action.payload.action === 'double' && state.lightPower !== BRIGHTNESS_OFF) {
          return {
            ...state,
            buttonState: action.payload,
            lightPower: state.lightPower === BRIGHTNESS_HIGH ? BRIGHTNESS_LOW : BRIGHTNESS_HIGH
          }
        }

        return {
          ...state,
          buttonState: action.payload,
          lightPower: state.lightPower === BRIGHTNESS_OFF ? BRIGHTNESS_HIGH : BRIGHTNESS_OFF
        }
      }

      return state
    }

    case UPDATE_PROFILE_DEFAULT:
      return { ...state, isProfileDefault: true, isProfileRainbow: false }

    case UPDATE_PROFILE_RAINBOW:
      return { ...state, isProfileRainbow: true, isProfileDefault: false }

    default:
      return state
  }
}

export default livingRoomReducer
