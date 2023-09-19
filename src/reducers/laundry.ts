import type { Reducer } from 'redux'

import { MOTION_SENSOR } from 'actions/laundry'
import type { LaundryAction } from 'actions/laundry'
import type { MotionSensorPayload } from 'types/payloads'

interface LaundryState {
  overrideLights: boolean
  motionSensorState: MotionSensorPayload
}

const initState: LaundryState = {
  overrideLights: false,
  motionSensorState: {
    battery: -1,
    batteryLow: false,
    occupancy: false
  }
}

const laundryReducer: Reducer<LaundryState, LaundryAction> = (state = initState, action) => {
  switch (action.type) {
    case MOTION_SENSOR: {
      return {
        ...state,
        motionSensorState: action.payload
      }
    }

    default:
      return state
  }
}

export default laundryReducer
