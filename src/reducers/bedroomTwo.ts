import type { Reducer } from 'redux'

import { UPDATE_BRIGHTNESS, UPDATE_PROFILE_BRIGHT, UPDATE_PROFILE_RAINBOW, UPDATE_PROFILE_SLEEP } from 'actions/bedroomTwo'
import { BRIGHTNESS_HIGH, BRIGHTNESS_OFF } from 'consts'
import type { BedroomTwoEvent } from 'actions/bedroomTwo'

export interface BedroomTwoState {
  isProfileBright: boolean
  isProfileRainbow: boolean
  isProfileSleep: boolean
  brightness: number
}

const initState: BedroomTwoState = {
  isProfileBright: true,
  isProfileRainbow: false,
  isProfileSleep: false,
  brightness: 254
}

const bedroomTwoReducer: Reducer<BedroomTwoState, BedroomTwoEvent> = (state = initState, action) => { // eslint-disable-line
  switch (action.type) {
    case UPDATE_BRIGHTNESS:
      return { ...state, brightness: action.brightness }

    case UPDATE_PROFILE_BRIGHT:
      return {
        ...state,
        isProfileBright: true,
        isProfileRainbow: false,
        isProfileSleep: false,
        brightness: BRIGHTNESS_HIGH
      }

    case UPDATE_PROFILE_RAINBOW:
      return {
        ...state,
        isProfileRainbow: true,
        isProfileBright: false,
        isProfileSleep: false,
        brightness: BRIGHTNESS_HIGH
      }

    case UPDATE_PROFILE_SLEEP:
      return {
        ...state,
        isProfileSleep: true,
        isProfileBright: false,
        isProfileRainbow: false,
        brightness: BRIGHTNESS_OFF
      }

    default:
      return state
  }
}

export default bedroomTwoReducer
