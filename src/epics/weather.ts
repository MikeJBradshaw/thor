import { combineEpics, ofType } from 'redux-observable'
import { catchError, map, switchMap } from 'rxjs/operators'
import { fromFetch } from 'rxjs/fetch'
import { of, timer } from 'rxjs'
import type { Observable } from 'rxjs'
// import type { StateObservable } from 'redux-observable'

import { SUPERVISOR_INIT } from 'actions/supervisor'
import { updateMeteoForecast } from 'actions/weather'
// import { updateMeteoForecast, UPDATE_METEO_FORECAST } from 'actions/weather'
import { METEO_URL, MINUTES_60_IN_MSEC } from 'consts'
import { noop } from 'actions/mqttClient'
import { getCurrentEpoch } from 'helpers/helpers'
import type { UpdateMeteoForecastAction, Daily, Hourly } from 'actions/weather'
import type { SupervisorInitAction } from 'actions/supervisor'
import type { MeteoForecastResponse, MeteoDaily, MeteoHourly } from 'types/responses'
import type { Noop } from 'actions/mqttClient'
// import type { RootState } from 'store'

const getDayForecast = (daily: MeteoDaily): Daily[] => {
  const {
    weather_code, //eslint-disable-line
    apparent_temperature_max, // eslint-disable-line
    apparent_temperature_min, // eslint-disable-line
    precipitation_probability_max // eslint-disable-line
  } = daily
  const dailyForecast: Daily[] = []
  for (let i = 0; i < weather_code.length; ++i) {
    dailyForecast.push({
      weatherCode: weather_code[i],
      apparentTempMax: apparent_temperature_max[i],
      apparentTempMin: apparent_temperature_min[i],
      precipitationProbabilityMax: precipitation_probability_max[i]
    })
  }
  return dailyForecast
}

const getHourlyForecast = (hourly: MeteoHourly): Hourly[] => {
  const {
    time,
    apparent_temperature, // eslint-disable-line
    precipitation_probability, // eslint-disable-line
    precipitation,
    weather_code // eslint-disable-line
  } = hourly
  const hourlyForecast: Hourly[] = []
  for (let i = 0; i < time.length; ++i) {
    hourlyForecast.push({
      time: time[i],
      apparentTemp: apparent_temperature[i],
      precipitationProbability: precipitation_probability[i],
      precipitation: precipitation[i],
      weatherCode: weather_code[i]
    })
  }

  return hourlyForecast
}

const getForecastEpic = (
  action$: Observable<SupervisorInitAction>
): Observable<UpdateMeteoForecastAction | Noop> => action$.pipe(
  ofType(SUPERVISOR_INIT),
  switchMap(() => timer(0, MINUTES_60_IN_MSEC).pipe(
    switchMap(() => fromFetch(METEO_URL, { selector: async res => await res.json() }).pipe(
      map(({ current, daily, hourly }: MeteoForecastResponse) => updateMeteoForecast({
        asOf: getCurrentEpoch(),
        current: {
          apparentTemp: current.apparent_temperature,
          precipitation: current.precipitation,
          weatherCode: current.weather_code
        },
        daily: getDayForecast(daily),
        hourly: getHourlyForecast(hourly)
      }))
    ))
  )),
  catchError((err: Error) => {
    console.error('Error fetching weather')
    console.error(err.message)
    return of(noop())
  })
)

// const weatherCodeWarningsEpic = (
//   action$: Observable<UpdateMeteoForecastAction>,
//   state$: StateObservable<RootState>
// ): Observable<Noop> => action$.pipe(
//   ofType(UPDATE_METEO_FORECAST),
//   map(() => {
//     const nextThreeHours = state$.
//     return noop()
//   })
// )

export default combineEpics(getForecastEpic as any)
