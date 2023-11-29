import type { Reducer } from 'redux'

import { WS_NORTH_LIGHTS_OFF, WS_NORTH_LIGHTS_ON, WS_SOUTH_LIGHTS_OFF, WS_SOUTH_LIGHTS_ON } from 'actions/hallway'
import type { HallwayActions } from 'actions/hallway'

export interface HallwayState {
  isRedLight: boolean
  isWhiteLight: boolean
  northLightsOn: boolean
  southLightsOn: boolean
}

const initState: HallwayState = {
  isRedLight: false,
  isWhiteLight: false,
  northLightsOn: false,
  southLightsOn: false
}

const hallwayReducer: Reducer<HallwayState, HallwayActions> = (state = initState, action) => {
  switch (action.type) {
    case WS_NORTH_LIGHTS_OFF:
      return { ...state, northLightsOn: false }

    case WS_NORTH_LIGHTS_ON:
      return { ...state, northLightsOn: true }

    case WS_SOUTH_LIGHTS_OFF:
      return { ...state, southLightsOn: false }

    case WS_SOUTH_LIGHTS_ON:
      return { ...state, southLightsOn: true }

    default:
      return state
  }
}

export default hallwayReducer
