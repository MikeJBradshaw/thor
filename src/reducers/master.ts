import type { Reducer } from 'redux'

import {
  MASTER_BATH_BUTTON_CLICK,
  MASTER_BATH_BUTTON_HOLD,
  MASTER_BATH_BUTTON_RELEASE,
  MASTER_BATH_MOTION_SENSOR
} from 'actions/master'
import {
  ROOM_STATE_DEFAULT,
  ROOM_STATE_DOUBLE
} from 'consts'
import type { MasterAction } from 'actions/master'
import type { ButtonPayload, MotionSensorPayload } from 'payloads'

interface MasterState {
  overrideMasterBathLights: boolean
  overrideMasterBathMotionSensor: boolean
  motionSensorState: MotionSensorPayload
  buttonState: ButtonPayload
}

const initState: MasterState = {
  overrideMasterBathLights: false,
  overrideMasterBathMotionSensor: false,
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
      const oldAction = state.buttonState.action
      const buttonAction = action.payload.action

      // want to set default IFF we are currently not in default mode AND old and new actions agree
      if (oldAction !== ROOM_STATE_DEFAULT && oldAction === buttonAction) {
        return {
          ...state,
          overrideMasterBathMotionSensor: false,
          buttonState: {
            ...state.buttonState,
            ...action.payload,
            action: ROOM_STATE_DEFAULT
          }
        }
      }

      // double click not supported
      if (buttonAction === ROOM_STATE_DOUBLE) {
        return state
      }

      return {
        ...state,
        overrideMasterBathMotionSensor: true,
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
