import { ofType, combineEpics } from 'redux-observable'
import { Observable, interval, of, timer, concat } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { fromFetch } from 'rxjs/fetch'
import type { StateObservable } from 'redux-observable'

import {
  SUPERVISOR_INIT,
  SUPERVISOR_NETWORK_ERROR,
  supervisorError,
  supervisorNetworkCheck,
  supervisorNetworkError,
  supervisorSetSunriseSunset
} from 'actions/supervisor'
import { powerOn, powerOff, noop } from 'actions/mqttClient'
import type {
  SupervisorErrorAction,
  SupervisorInitAction,
  SupervisorNetworkCheckAction,
  SupervisorNetworkErrorAction,
  SupervisorSetSunriseSunsetAction
} from 'actions/supervisor'
import { deltaToMidnight } from 'helpers/helpers'
import { HOURS_24, NETWORK_NO_RESPONSE_TIMEOUT, SUNRISE_SUNSET_API } from 'consts'
import type { PowerOff, PowerOn, Noop } from 'actions/mqttClient'
import type { SunriseSunsetResponse } from 'types/responses'
import type { RootState } from 'store'

type NetworkCheckEpicReturnType = Observable<SupervisorNetworkCheckAction | SupervisorErrorAction | SupervisorNetworkErrorAction>
const networkCheckEpic = (
  action$: Observable<SupervisorInitAction>
): NetworkCheckEpicReturnType => action$.pipe(
  ofType(SUPERVISOR_INIT),
  // tap(() => console.log('starting interval epic')),
  switchMap(() => interval(1000 * 60 * 2).pipe(
    switchMap(() => fromFetch('https://google.com').pipe(
      switchMap((res, index) => {
        if (res.status === 200) {
          return of(supervisorNetworkCheck(new Date()))
        }
        return of(supervisorNetworkError())
      })
    )),
    catchError(_ => of(supervisorNetworkError()))
  )),
  catchError(err => {
    console.log(err.message)
    return of(supervisorError(err))
  })
)

type NetworkErrorEpicReturnType = Observable<PowerOff | PowerOn | Noop>
const networkErrorEpic = (
  action$: Observable<SupervisorNetworkErrorAction>,
  state$: StateObservable<RootState>
): NetworkErrorEpicReturnType => action$.pipe(
  ofType(SUPERVISOR_NETWORK_ERROR),
  switchMap(() => {
    const currentTime: Date = new Date()
    const lastNetworkUpdate: Date = state$.value.supervisorReducer.lastSuccessfulInternetCheck

    if (+currentTime - +lastNetworkUpdate > NETWORK_NO_RESPONSE_TIMEOUT) {
      return of(noop())
    }
    return of(noop())
  })
)

/**
 * Queries sunrise-sunset API to determine when to send main light information
 *
 * @remarks This will query upon start, the delta to midnight, then every midnight after
 */
type SunriseSunsetEpicResponseType = Observable<SupervisorSetSunriseSunsetAction | SupervisorErrorAction>
export const sunriseSunsetEpic = (
  action$: Observable<SupervisorInitAction>
): SunriseSunsetEpicResponseType => action$.pipe(
  ofType(SUPERVISOR_INIT),
  switchMap(() => fromFetch(
    `${SUNRISE_SUNSET_API}/json?lat=39.1097&lng=-95.0877&date=today&formatted=0`,
    { selector: async (res) => await res.json() }
  ).pipe(
    switchMap(({ status, results }: SunriseSunsetResponse) => concat(
      of(supervisorSetSunriseSunset(
        {
          sunrise: results.sunrise,
          sunset: results.sunset,
          solarNoon: results.solar_noon,
          civilTwilightEnd: results.civil_twilight_end,
          civilTwilightBegin: results.civil_twilight_begin
        }
      )),
      timer(deltaToMidnight(), HOURS_24).pipe(
        switchMap(() => fromFetch(
          `${SUNRISE_SUNSET_API}/json?lat=39.1097&lng=-95.0877&date=today&formatted=0`,
          { selector: async (res) => await res.json() }
        ).pipe(
          map(({ status, results }: SunriseSunsetResponse) => supervisorSetSunriseSunset(
            {
              sunrise: results.sunrise,
              sunset: results.sunset,
              solarNoon: results.solar_noon,
              civilTwilightEnd: results.civil_twilight_end,
              civilTwilightBegin: results.civil_twilight_begin
            }
          ))
        ))
      )
    ))
  ))
)

export default combineEpics(networkCheckEpic as any, networkErrorEpic as any, sunriseSunsetEpic as any)
