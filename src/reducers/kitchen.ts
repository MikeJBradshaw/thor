import type { Reducer } from 'redux'

import { BRIGHT_PROFILE, LOW_LIGHT_PROFILE } from 'actions/kitchen'
import { NIGHT_MODE, IS_SUNRISE } from 'actions/supervisor'
import type { KitchenAction } from 'actions/kitchen'
import type { SupervisorAction } from 'actions/supervisor'

export interface KitchenState {
  isProfileLowLight: boolean
  isProfileBright: boolean
  isRedLight: boolean
}

const initState: KitchenState = {
  isProfileLowLight: false,
  isProfileBright: false,
  isRedLight: false
}

const kitchenReducer: Reducer<KitchenState, KitchenAction | SupervisorAction> = (state = initState, action) => { // eslint-disable-line
  switch (action.type) {
    case BRIGHT_PROFILE:
      return { ...state, isProfileBright: true, isProfileLowLight: false }

    case LOW_LIGHT_PROFILE:
      return { ...state, isProfileLowLight: true, isProfileBright: false }

    case IS_SUNRISE:
      return { ...state, isRedLight: false }

    case NIGHT_MODE:
      return { ...state, isRedLight: true }

    default:
      return state
  }
}

export default kitchenReducer
