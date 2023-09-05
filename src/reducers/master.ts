import type { Reducer } from 'redux'

import {
  MASTER_BATH_BUTTON_HOLD,
  MASTER_BATH_BUTTON_RELEASE,
  MASTER_BATH_MOTION_SENSOR
} from 'actions/master'
import type { MasterAction } from 'actions/master'
import type { MotionSensorPayload } from 'payloads'

interface MasterState {
  overrideMasterBathLights: boolean
  overrideMasterBathMotionSensor: boolean
  motionSensorState: MotionSensorPayload
}

const initState: MasterState = {
  overrideMasterBathLights: false,
  overrideMasterBathMotionSensor: false,
  motionSensorState: {
    battery: -1,
    batteryLow: false,
    occupancy: false
  }
}

const masterReducer: Reducer<MasterState, MasterAction> = (state = initState, action) => {
  switch (action.type) {
    case MASTER_BATH_MOTION_SENSOR: {
      return {
        ...state,
        motionSensorState: action.payload
      }
    }

    case MASTER_BATH_BUTTON_HOLD: {
      return { ...state, overrideMasterBathMotionSensor: true }
    }

    case MASTER_BATH_BUTTON_RELEASE: {
      return { ...state, overrideMasterBathMotionSensor: false }
    }

    default:
      return state
  }
}

export default masterReducer
