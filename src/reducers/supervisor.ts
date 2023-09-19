import type { Reducer } from 'redux'

import { SUPERVISOR_NETWORK_CHECK, SUPERVISOR_SET_SUNRISE_SUNSET } from 'actions/supervisor'
import { utcDateToLocal } from 'helpers/helpers'
import type { SupervisorAction } from 'actions/supervisor'
import type { SunData } from 'types/payloads'

interface SupervisorState {
  initTime: Date
  lastSuccessfulInternetCheck: Date
  sunData: SunData
}

const initState: SupervisorState = {
  initTime: new Date(),
  lastSuccessfulInternetCheck: new Date(),
  sunData: {
    sunrise: '',
    sunset: '',
    solarNoon: '',
    civilTwilightBegin: '',
    civilTwilightEnd: ''
  }
}

const supervisorReducer: Reducer<SupervisorState, SupervisorAction> = (state = initState, action) => {
  switch (action.type) {
    case SUPERVISOR_NETWORK_CHECK:
      return { ...state, lastSuccessfulInternetCheck: action.responseTime }

    case SUPERVISOR_SET_SUNRISE_SUNSET: {
      const sunrise = utcDateToLocal(action.data.sunrise)
      const sunset = utcDateToLocal(action.data.sunset)
      const solarNoon = utcDateToLocal(action.data.solarNoon)
      const civilTwilightBegin = utcDateToLocal(action.data.civilTwilightBegin)
      const civilTwilightEnd = utcDateToLocal(action.data.civilTwilightEnd)

      return { ...state, sunData: { sunrise, sunset, solarNoon, civilTwilightBegin, civilTwilightEnd } }
    }

    default:
      return state
  }
}

export default supervisorReducer
