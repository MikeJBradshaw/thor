import type { Reducer } from 'redux'

import {
  MASTER_BATH_CHANGE_GROUP_RED_LIGHT,
  MASTER_BATH_CHANGE_GROUP_WHITE_LIGHT,
  MASTER_BATH_DISABLE_MANUAL,
  MASTER_BATH_MOTION_SENSOR,
  MASTER_BATH_OVERRIDE_SENSOR,
  MASTER_BATH_SHOWER_TIMER,
  MASTER_BATH_TIMER_EXPIRE
} from 'actions/master'
import { BRIGHTNESS_OFF } from 'consts'
import type { MasterAction } from 'actions/master'

export interface MasterState {
  isRedLight: boolean
  isWhiteLight: boolean
  occupancy: boolean
  group: { brightness: number }
  overrideMasterBathLights: boolean
  overrideMasterBathMotionSensor: boolean
}

const initState: MasterState = {
  isRedLight: false,
  isWhiteLight: false,
  occupancy: false,
  group: { brightness: BRIGHTNESS_OFF },
  overrideMasterBathLights: false,
  overrideMasterBathMotionSensor: false
}

const masterReducer: Reducer<MasterState, MasterAction> = (state = initState, action) => {
  switch (action.type) {
    case MASTER_BATH_CHANGE_GROUP_RED_LIGHT:
      return { ...state, isRedLight: true, isWhiteLight: false }

    case MASTER_BATH_CHANGE_GROUP_WHITE_LIGHT:
      return { ...state, isRedLight: false, isWhiteLight: true }

    case MASTER_BATH_DISABLE_MANUAL:
    case MASTER_BATH_TIMER_EXPIRE:
      return { ...state, overrideMasterBathMotionSensor: false, overrideMasterBathLights: false }

    case MASTER_BATH_MOTION_SENSOR:
      return { ...state, occupancy: action.payload.occupancy }

    case MASTER_BATH_OVERRIDE_SENSOR:
    case MASTER_BATH_SHOWER_TIMER:
      return { ...state, overrideMasterBathLights: true, overrideMasterBathMotionSensor: true }

    default:
      return state
  }
}

export default masterReducer
