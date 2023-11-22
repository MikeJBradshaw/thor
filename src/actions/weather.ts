export interface Current {
  apparentTemp: number
  precipitation: number
  weatherCode: number
}

export interface Daily {
  weatherCode: number
  apparentTempMax: number
  apparentTempMin: number
  precipitationProbabilityMax: number
}

export interface Hourly {
  time: number
  apparentTemp: number
  precipitationProbability: number
  precipitation: number
  weatherCode: number
}

export interface MeteoForecast {
  asOf: number
  daily: Daily[]
  hourly: Hourly[]
  current: Current
}

export const UPDATE_METEO_FORECAST = 'WEATHER_UPDATE_METEO_FORECAST'
export interface UpdateMeteoForecastAction { type: typeof UPDATE_METEO_FORECAST, payload: MeteoForecast }
export const updateMeteoForecast = (payload: MeteoForecast): UpdateMeteoForecastAction => ({
  type: UPDATE_METEO_FORECAST,
  payload
})

export const UPDATE_NOAA_WEATHER_ZONES = 'WEATHER_UPDATE_NOAA_WEATHER_ZONES'
export interface UpdateNoaaWeatherZonesAction { type: typeof UPDATE_NOAA_WEATHER_ZONES }
export const updateNoaaWeatherZones = (): UpdateNoaaWeatherZonesAction => ({ type: UPDATE_NOAA_WEATHER_ZONES })

export const UPDATE_STATE = 'WEATHER_UPDATE_STATE'
export interface UpdateStateAction { type: typeof UPDATE_STATE }
export const updateState = (): UpdateStateAction => ({ type: UPDATE_STATE })

export type WeatherAction = UpdateMeteoForecastAction
| UpdateNoaaWeatherZonesAction
| UpdateStateAction
