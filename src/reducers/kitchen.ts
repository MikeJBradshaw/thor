import type { Reducer } from 'redux'

import { BRIGHT_PROFILE, LOW_LIGHT_PROFILE } from 'actions/kitchen'
import type { KitchenAction } from 'actions/kitchen'
import type { SupervisorAction } from 'actions/supervisor'

export interface KitchenState {
  isProfileLowLight: boolean
  isProfileBright: boolean
}

const initState: KitchenState = {
  isProfileLowLight: false,
  isProfileBright: false
}

const kitchenReducer: Reducer<KitchenState, KitchenAction | SupervisorAction> = (state = initState, action) => { // eslint-disable-line
  switch (action.type) {
    case BRIGHT_PROFILE:
      return { ...state, isProfileBright: true, isProfileLowLight: false }

    case LOW_LIGHT_PROFILE:
      return { ...state, isProfileLowLight: true, isProfileBright: false }
    default:
      return state
  }
}

export default kitchenReducer
