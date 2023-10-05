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

interface MasterState {
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
      return { ...state, overrideMasterBathMotionSensor: false, overrideMasterBathLights: false }

    case MASTER_BATH_MOTION_SENSOR:
      return { ...state, occupancy: true }

    case MASTER_BATH_OVERRIDE_SENSOR:
      return { ...state, overrideMasterBathLights: true, overrideMasterBathMotionSensor: true }

    case MASTER_BATH_SHOWER_TIMER:
      return { ...state, overrideMasterBathLights: true, overrideMasterBathMotionSensor: true }

    case MASTER_BATH_TIMER_EXPIRE:
      return { ...state, overrideMasterBathLights: false, overrideMasterBathMotionSensor: false }

    default:
      return state
  }
}

export default masterReducer
