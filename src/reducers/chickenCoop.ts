import type { Reducer } from 'redux'

import { TEMPERATURE_HUMIDITY } from 'actions/chickenCoop'
import type { ChickenCoopAction } from 'actions/chickenCoop'
import type { TemperatureAndHumdityPayload } from 'payloads'

interface ChickenCoopState {
  tempHumidityState: TemperatureAndHumdityPayload
}

const initState: ChickenCoopState = {
  tempHumidityState: {
    battery: -1,
    humidity: -1,
    linkQuality: -1,
    temperature: -1
  }
}

const chickenCoopReducer: Reducer<ChickenCoopState, ChickenCoopAction> = (state = initState, action) => {
  switch (action.type) {
    case TEMPERATURE_HUMIDITY: {
      return { ...state, tempHumidityState: action.payload }
    }

    default:
      return state
  }
}

export default chickenCoopReducer
