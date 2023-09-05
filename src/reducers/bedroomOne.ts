import type { Reducer } from 'redux'

import { ButtonState, BUTTON_CLICK, BUTTON_HOLD, BUTTON_RELEASE } from 'actions/bedroomOne'
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
  buttonState: ButtonState
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
  buttonState: ButtonState.Default,
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
    case BUTTON_CLICK: {
      const currentButtonState = state.buttonState
      if (action.state !== currentButtonState) {
        return {
          ...state,
          buttonState: action.state
        }
      }

      return {
        ...state,
        buttonState: (currentButtonState === ButtonState.Default ? action.state : ButtonState.Default)
      }
    }

    case BUTTON_HOLD: {
      return { ...state, overrideLights: true }
    }

    case BUTTON_RELEASE: {
      return { ...state, overrideLights: false }
    }

    default:
      return state
  }
}

export default bedroomOneReducer
