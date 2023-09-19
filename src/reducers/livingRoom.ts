import type { Reducer } from 'redux'

import { LIVING_ROOM_BUTTON_CLICK } from 'actions/livingRoom'
import type { LivingRoomAction } from 'actions/livingRoom'
import type { ButtonPayload } from 'types/payloads'

interface LivingRoomState {
  overrideLivingRoomLights: boolean
  buttonState: ButtonPayload
}

const initState: LivingRoomState = {
  overrideLivingRoomLights: false,
  buttonState: {
    action: '',
    battery: -1,
    linkquality: -1
  }
}

const livingRoomReducer: Reducer<LivingRoomState, LivingRoomAction> = (state = initState, action) => {
  switch (action.type) {
    case LIVING_ROOM_BUTTON_CLICK: {
      return {
        ...state,
        buttonState: action.payload,
        overrideLivingRoomLights: (
          action.payload.action === 'single' || action.payload.action === 'double'
        ) && !state.overrideLivingRoomLights
      }
    }

    default:
      return state
  }
}

export default livingRoomReducer
