import type { Reducer } from 'redux'

import { SUPERVISOR_NETWORK_CHECK } from 'actions/supervisor'
import type { SupervisorAction } from 'actions/supervisor'

interface SupervisorState {
  initTime: Date
  lastSuccessfulInternetCheck: Date
}

const initState = {
  initTime: new Date(),
  lastSuccessfulInternetCheck: new Date()
}

const supervisorReducer: Reducer<SupervisorState, SupervisorAction> = (state = initState, action) => {
  switch (action.type) {
    case SUPERVISOR_NETWORK_CHECK:

      return { ...state, lastSuccessfulInternetCheck: action.responseTime }

    default:
      return state
  }
}

export default supervisorReducer
