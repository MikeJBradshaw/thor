import type { Reducer } from 'redux'

import {
  MASTER_BATH_BUTTON_CLICK,
  MASTER_BATH_BUTTON_HOLD,
  MASTER_BATH_BUTTON_RELEASE,
  MASTER_BATH_MOTION_SENSOR
} from 'actions/master'
import {
  BUTTON_STATE_DOUBLE,
  ROOM_STATE_DEFAULT,
  ROOM_STATE_SINGLE
} from 'consts'
import type { MasterAction } from 'actions/master'
import type { ButtonPayload, MotionSensorPayload } from 'types/payloads'

interface MasterState {
  overrideMasterBathLights: boolean
  overrideMasterBathMotionSensor: boolean
  roomState: string
  motionSensorState: MotionSensorPayload
  buttonState: ButtonPayload
}

const initState: MasterState = {
  overrideMasterBathLights: false,
  overrideMasterBathMotionSensor: false,
  roomState: ROOM_STATE_DEFAULT,
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

const masterReducer: Reducer<MasterState, MasterAction> = (state = initState, action) => {
  switch (action.type) {
    case MASTER_BATH_BUTTON_CLICK: {
      const roomState = state.roomState
      const buttonAction = action.payload.action

      // double click not supported
      if (buttonAction === BUTTON_STATE_DOUBLE) {
        return state
      }

      // button click single and room state already single -> default
      if (roomState === ROOM_STATE_SINGLE) {
        return {
          ...state,
          overrideMasterBathMotionSensor: false,
          roomState: ROOM_STATE_DEFAULT,
          buttonState: action.payload
        }
      }

      // button click single and room state default -> single
      return {
        ...state,
        overrideMasterBathMotionSensor: true,
        roomState: ROOM_STATE_SINGLE,
        buttonState: action.payload
      }
    }

    case MASTER_BATH_BUTTON_HOLD: {
      return { ...state, overrideMasterBathMotionSensor: true, buttonState: action.payload }
    }

    case MASTER_BATH_BUTTON_RELEASE: {
      return { ...state, overrideMasterBathMotionSensor: false, buttonState: action.payload }
    }

    case MASTER_BATH_MOTION_SENSOR: {
      return {
        ...state,
        motionSensorState: action.payload
      }
    }

    default:
      return state
  }
}

export default masterReducer
