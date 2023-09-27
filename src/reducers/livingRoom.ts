import type { Reducer } from 'redux'

import { LIVING_ROOM_BUTTON_CLICK } from 'actions/livingRoom'
import { BRIGHTNESS_LOW, BRIGHTNESS_HIGH, BRIGHTNESS_OFF } from 'consts'
import type { LivingRoomAction } from 'actions/livingRoom'
import type { ButtonPayload } from 'types/payloads'

interface LivingRoomState {
  overrideLivingRoomLights: boolean
  lightPower: number
  buttonState: ButtonPayload
}

const initState: LivingRoomState = {
  overrideLivingRoomLights: false,
  lightPower: BRIGHTNESS_OFF,
  buttonState: {
    action: '',
    battery: -1,
    linkquality: -1
  }
}

const livingRoomReducer: Reducer<LivingRoomState, LivingRoomAction> = (state = initState, action) => {
  switch (action.type) {
    case LIVING_ROOM_BUTTON_CLICK: {
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

    default:
      return state
  }
}

export default livingRoomReducer
