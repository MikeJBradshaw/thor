import type { Reducer } from 'redux'

import { UPDATE_METEO_FORECAST } from 'actions/weather'
import type { MeteoForecast, WeatherAction } from 'actions/weather'

export interface WeatherState {
  forecast: MeteoForecast
}

const initState: WeatherState = {
  forecast: {
    asOf: -1,
    current: {
      apparentTemp: -1,
      precipitation: -1,
      weatherCode: -1
    },
    daily: [],
    hourly: []
  }
}

const weatherReducer: Reducer<WeatherState, WeatherAction> = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_METEO_FORECAST:
      return { ...state, forecast: action.payload }

    default:
      return state
  }
}

export default weatherReducer
