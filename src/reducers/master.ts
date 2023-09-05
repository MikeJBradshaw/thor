import type { Reducer } from 'redux'

import {
  MASTER_BATH_BUTTON_CLICK,
  MASTER_BATH_BUTTON_HOLD,
  MASTER_BATH_BUTTON_RELEASE,
  MASTER_BATH_MOTION_SENSOR
} from 'actions/master'
import { ButtonState } from 'payloads'
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
    action: 'default',
    battery: -1,
    linkquality: -1
  }
}

const masterReducer: Reducer<MasterState, MasterAction> = (state = initState, action) => {
  switch (action.type) {
    case MASTER_BATH_BUTTON_CLICK: {
      const oldAction = state.buttonState.action
      const buttonAction = action.payload.action

      if (oldAction !== ButtonState.Default && oldAction === buttonAction) {
        return {
          ...state,
          overrideMasterBathMotionSensor: false,
          buttonState: {
            ...state.buttonState,
            action: ButtonState.Default
          }
        }
      }

      // we are in default mode, take new state or something like single and new action is double
      return {
        ...state,
        overrideMasterBathMotionSensor: buttonAction === ButtonState.Single,
        buttonstate: action.payload
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
