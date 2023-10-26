import type { Reducer } from 'redux'

import {
  UPDATE_BRIGHTNESS,
  UPDATE_OCCUPANCY,
  UPDATE_POWER_OFF,
  UPDATE_POWER_ON,
  UPDATE_PROFILE_BRIGHT,
  UPDATE_PROFILE_COLORS,
  UPDATE_PROFILE_DEFAULT,
  UPDATE_PROFILE_RED,
  UPDATE_PROFILE_SLEEP,
  UPDATE_RED_LIGHT_ON,
  UPDATE_WHITE_LIGHT_ON
} from 'actions/bedroomOne'
import { BRIGHTNESS_OFF } from 'consts'
import type { BedroomOneAction } from 'actions/bedroomOne'

export interface BedroomOneState {
  brightness: number
  isProfileBright: boolean
  isProfileColors: boolean
  isProfileDefault: boolean
  isProfileRed: boolean
  isProfileSleep: boolean
  isRedLight: boolean
  isWhiteLight: boolean
  occupancy: boolean
  power: boolean
}

const initState: BedroomOneState = {
  brightness: BRIGHTNESS_OFF,
  isProfileBright: false,
  isProfileColors: false,
  isProfileDefault: true,
  isProfileRed: false,
  isProfileSleep: false,
  isRedLight: false,
  isWhiteLight: false,
  occupancy: false,
  power: false
}

const bedroomOneReducer: Reducer<BedroomOneState, BedroomOneAction> = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_BRIGHTNESS:
      return { ...state, brightness: action.payload }

    case UPDATE_OCCUPANCY:
      return { ...state, occupancy: action.payload.occupancy }

    case UPDATE_PROFILE_BRIGHT:
      return {
        ...state,
        brightness: 255,
        isProfileBright: true,
        isProfileColors: false,
        isProfileDefault: false,
        isProfileRed: false,
        isProfileSleep: false,
        isRedLight: false,
        isWhiteLight: true
      }

    case UPDATE_POWER_OFF:
      return { ...state, power: false }

    case UPDATE_POWER_ON:
      return { ...state, power: true }

    case UPDATE_PROFILE_COLORS:
      return {
        ...state,
        brightness: 255,
        isProfileBright: false,
        isProfileColors: true,
        isProfileDefault: false,
        isProfileRed: false,
        isProfileSleep: false,
        isRedLight: false,
        isWhiteLight: false,
        power: false
      }

    case UPDATE_PROFILE_DEFAULT:
      return {
        ...state,
        brightness: 255,
        isProfileBright: false,
        isProfileColors: false,
        isProfileDefault: true,
        isProfileRed: false,
        isProfileSleep: false,
        isRedLight: false,
        isWhiteLight: false,
        power: false
      }

    case UPDATE_PROFILE_RED:
      return {
        ...state,
        brightness: 5,
        isProfileBright: false,
        isProfileColors: false,
        isProfileDefault: false,
        isProfileRed: true,
        isProfileSleep: false,
        isRedLight: true,
        isWhiteLight: false
      }

    case UPDATE_PROFILE_SLEEP:
      return {
        ...state,
        brightness: 0,
        isProfileBright: false,
        isProfileColors: false,
        isProfileDefault: false,
        isProfileRed: false,
        isProfileSleep: true,
        isRedLight: false,
        isWhiteLight: false,
        power: true
      }
    
    case UPDATE_RED_LIGHT_ON:
      return { ...state, isRedLight: true, isWhiteLight: false }

    case UPDATE_WHITE_LIGHT_ON:
      return { ...state, isRedLight: false, isWhiteLight: true }

    default:
      return state
  }
}

export default bedroomOneReducer
