import type { Reducer } from 'redux'

import {
  UPDATE_BRIGHTNESS,
  UPDATE_OCCUPANCY,
  UPDATE_PROFILE_BRIGHT,
  UPDATE_PROFILE_COLORS,
  UPDATE_PROFILE_DEFAULT,
  UPDATE_PROFILE_RED,
  UPDATE_PROFILE_SLEEP
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
  occupancy: boolean
}

const initState: BedroomOneState = {
  brightness: BRIGHTNESS_OFF,
  isProfileBright: false,
  isProfileColors: false,
  isProfileDefault: true,
  isProfileRed: false,
  isProfileSleep: false,
  occupancy: false
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
        isProfileBright: true,
        isProfileColors: false,
        isProfileDefault: false,
        isProfileRed: false,
        isProfileSleep: false
      }

    case UPDATE_PROFILE_COLORS:
      return {
        ...state,
        isProfileBright: false,
        isProfileColors: true,
        isProfileDefault: false,
        isProfileRed: false,
        isProfileSleep: false
      }

    case UPDATE_PROFILE_DEFAULT:
      return {
        ...state,
        isProfileBright: false,
        isProfileColors: false,
        isProfileDefault: true,
        isProfileRed: false,
        isProfileSleep: false
      }

    case UPDATE_PROFILE_RED:
      return {
        ...state,
        isProfileBright: false,
        isProfileColors: false,
        isProfileDefault: false,
        isProfileRed: true,
        isProfileSleep: false
      }

    case UPDATE_PROFILE_SLEEP:
      return {
        ...state,
        isProfileBright: false,
        isProfileColors: false,
        isProfileDefault: false,
        isProfileRed: false,
        isProfileSleep: true
      }

    default:
      return state
  }
}

export default bedroomOneReducer
