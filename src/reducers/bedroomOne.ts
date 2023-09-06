import type { Reducer } from 'redux'

import { BEDROOM_ONE_BUTTON_CLICK, BEDROOM_ONE_BUTTON_HOLD, BEDROOM_ONE_BUTTON_RELEASE } from 'actions/bedroomOne'
import { ButtonPayload } from 'payloads'
import {
  BUTTON_STATE_DOUBLE,
  BUTTON_STATE_HOLD,
  BUTTON_STATE_RELEASE,
  BUTTON_STATE_SINGLE,
  ROOM_STATE_DEFAULT,
  ROOM_STATE_DOUBLE,
  ROOM_STATE_SINGLE
} from 'consts'
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
  roomSetup: string
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
    action: '',
    battery: -1,
    linkquality: -1
  },
  roomSetup: ROOM_STATE_DEFAULT,
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
      // single -> single || double -> double
      const roomSetup = state.roomSetup
      const buttonAction = action.payload.action
      if ((buttonAction === BUTTON_STATE_SINGLE && roomSetup === ROOM_STATE_SINGLE) ||
          (buttonAction === BUTTON_STATE_DOUBLE && roomSetup === ROOM_STATE_DOUBLE)) {
        return {
          ...state,
          buttonState: action.payload,
          roomSetup: ROOM_STATE_DEFAULT
        }
      }

      // single -> double || double -> single
      if ((roomSetup === ROOM_STATE_SINGLE && buttonAction === BUTTON_STATE_DOUBLE) ||
          (roomSetup === ROOM_STATE_DOUBLE && buttonAction === BUTTON_STATE_SINGLE)) {
        return {
          ...state,
          buttonState: action.payload,
          roomSetup: (action.payload.action === BUTTON_STATE_SINGLE) ? ROOM_STATE_SINGLE : ROOM_STATE_DOUBLE
        }
      }

      // default -> something else
      return {
        ...state,
        buttonState: action.payload,
        roomSetup: action.payload.action === BUTTON_STATE_SINGLE ? ROOM_STATE_SINGLE : ROOM_STATE_DOUBLE
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
