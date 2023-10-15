import type { Reducer } from 'redux'

import {
  CHANGE_GROUP_RED_LIGHT,
  CHANGE_GROUP_WHITE_LIGHT,
  MASTER_BATH_MOTION_SENSOR,
  UPDATE_BRIGHTNESS,
  UPDATE_MANUAL_PROFILE,
  UPDATE_SENSOR_PROFILE,
  UPDATE_SHOWER_TIMER,
  UPDATE_TIMER_EXPIRE
} from 'actions/master'
import { BRIGHTNESS_OFF } from 'consts'
import type { MasterAction } from 'actions/master'

export interface MasterState {
  isRedLight: boolean
  isWhiteLight: boolean
  occupancy: boolean
  isProfileSensor: boolean
  isProfileShower: boolean
  isProfileManual: boolean
  brightness: number
}

const initState: MasterState = {
  isRedLight: false,
  isWhiteLight: false,
  occupancy: false,
  isProfileSensor: true,
  isProfileShower: false,
  isProfileManual: false,
  brightness: BRIGHTNESS_OFF
}

const masterReducer: Reducer<MasterState, MasterAction> = (state = initState, action) => {
  switch (action.type) {
    case CHANGE_GROUP_RED_LIGHT:
      return {
        ...state,
        isRedLight: !state.isRedLight && !state.isProfileShower,
        isWhiteLight: false,
        isProfileManual: !state.isRedLight,
        isProfileSensor: state.isRedLight
      }

    case CHANGE_GROUP_WHITE_LIGHT:
      return {
        ...state,
        isRedLight: false,
        isWhiteLight: !state.isWhiteLight && !state.isProfileShower,
        isProfileManual: !state.isWhiteLight,
        isProfileSensor: state.isWhiteLight
      }

    case MASTER_BATH_MOTION_SENSOR:
      return { ...state, occupancy: action.payload.occupancy }

    case UPDATE_BRIGHTNESS:
      return { ...state, brightness: action.brightness }

    case UPDATE_MANUAL_PROFILE:
      return { ...state, isProfileSensor: false, isProfileManual: true, isProfileShower: false }

    case UPDATE_SHOWER_TIMER:
      return { ...state, isProfileShower: true, isProfileManual: true, isProfileSensor: false }

    case UPDATE_SENSOR_PROFILE:
    case UPDATE_TIMER_EXPIRE:
      return {
        ...state,
        isProfileSensor: true,
        isProfileManual: false,
        isProfileShower: false,
        isRedLight: false,
        isWhiteLight: false
      }

    default:
      return state
  }
}

export default masterReducer
