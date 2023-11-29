import type { Reducer } from 'redux'

import { NETWORK_CHECK, SET_SUNRISE_SUNSET, NETWORK_END_RESTART, NETWORK_RESTART } from 'actions/supervisor'
import { dateToEpoch } from 'helpers/helpers'
import type { SupervisorAction } from 'actions/supervisor'
import type { SunData } from 'types/payloads'

interface SupervisorState {
  initTime: number
  lastSuccessfulInternetCheck: number
  networkRestart: boolean
  sunData: SunData
}

const initState: SupervisorState = {
  initTime: new Date().getSeconds(),
  lastSuccessfulInternetCheck: -1,
  networkRestart: false,
  sunData: {
    sunrise: -1,
    sunset: -1,
    solarNoon: -1,
    civilTwilightBegin: -1,
    civilTwilightEnd: -1
  }
}

const supervisorReducer: Reducer<SupervisorState, SupervisorAction> = (state = initState, action) => {
  switch (action.type) {
    case NETWORK_CHECK:
      return { ...state, lastSuccessfulInternetCheck: action.responseEpoch }

    case SET_SUNRISE_SUNSET: {
      const sunrise = dateToEpoch(action.payload.sunrise)
      const sunset = dateToEpoch(action.payload.sunset)
      const solarNoon = dateToEpoch(action.payload.solarNoon)
      const civilTwilightBegin = dateToEpoch(action.payload.civilTwilightBegin)
      const civilTwilightEnd = dateToEpoch(action.payload.civilTwilightEnd)

      return { ...state, sunData: { sunrise, sunset, solarNoon, civilTwilightBegin, civilTwilightEnd } }
    }

    case NETWORK_RESTART:
      return { ...state, networkRestart: true }

    case NETWORK_END_RESTART:
      return { ...state, networkRestart: false }

    default:
      return state
  }
}

export default supervisorReducer
