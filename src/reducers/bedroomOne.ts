import type { Reducer } from 'redux'

import { BEDROOM_ONE_BUTTON_CLICK, BEDROOM_ONE_BUTTON_HOLD, BEDROOM_ONE_BUTTON_RELEASE } from 'actions/bedroomOne'
import { ButtonState, ButtonPayload } from 'payloads'
import type { BedroomOneAction } from 'actions/bedroomOne'

// const RED = '#FF0000'
const HOT_PINK = '#FF69B4'
const BRIGHTNESS_OFF = 0
// const BRIGHTNESS_LOW = 15
const BRIGHTNESS_HIGH = 255
const DAY_END = '19:30:00'
const DAY_START = '06:45:00'

interface LightValues {
  brightness: number
  color: string
  colorTemp: 'warmest' | 'warm' | 'neutral' | 'cool' | 'coolest'
}

interface BedroomOneState {
  buttonState: ButtonPayload
  roomSetup: ButtonState
  overrideLights: boolean
  defaultState: {
    type: 'color-light' | 'white-light'
    values: LightValues
  }
  singleClickState: {
    type: 'color-light' | 'white-light'
    values: LightValues
  }
  doubleClickState: {
    type: 'color-light' | 'white-light'
    values: LightValues
  }
  publishColor: boolean
}

const initState: BedroomOneState = {
  buttonState: {
    action: ButtonState.Default,
    battery: -1,
    linkquality: -1
  },
  roomSetup: ButtonState.Default,
  overrideLights: false,
  defaultState: {
    type: 'color-light',
    values: {
      brightness: BRIGHTNESS_HIGH,
      color: HOT_PINK,
      colorTemp: 'neutral'
    }
  },
  singleClickState: {
    type: 'color-light',
    values: {
      brightness: BRIGHTNESS_OFF,
      color: HOT_PINK,
      colorTemp: 'neutral'
    }
  },
  doubleClickState: {
    type: 'white-light',
    values: {
      brightness: BRIGHTNESS_HIGH,
      color: HOT_PINK,
      colorTemp: 'neutral'
    }
  },
  publishColor: true
}

const bedroomOneReducer: Reducer<BedroomOneState, BedroomOneAction> = (state = initState, action) => {
  switch (action.type) {
    case BEDROOM_ONE_BUTTON_CLICK: {
      if (action.payload.action !== state.roomSetup) {
        return {
          ...state,
          buttonState: action.payload,
          roomSetup: ButtonState.Default
        }
      }

      return {
        ...state,
        buttonState: action.payload,
        roomSetup: action.payload.action
      }
    }

    case BEDROOM_ONE_BUTTON_HOLD: {
      return { ...state, buttonState: action.payload, overrideLights: true }
    }

    case BEDROOM_ONE_BUTTON_RELEASE: {
      return { ...state, buttonState: action.payload, overrideLights: false }
    }

    default:
      return state
  }
}

export default bedroomOneReducer
