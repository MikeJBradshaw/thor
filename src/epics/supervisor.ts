import { ofType, combineEpics } from 'redux-observable'
import { Observable, interval, of, timer, concat } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { fromFetch } from 'rxjs/fetch'
import type { StateObservable } from 'redux-observable'

import {
  SUPERVISOR_INIT,
  NETWORK_ERROR,
  NETWORK_END_RESTART,
  supervisorError,
  networkCheck,
  networkError,
  setSunriseSunset,
  networkRestart,
  networkEndRestart
} from 'actions/supervisor'
import { powerOn, powerOff, noop } from 'actions/mqttClient'
import type {
  SupervisorErrorAction,
  SupervisorInitAction,
  NetworkCheckAction,
  NetworkErrorAction,
  SetSunriseSunsetAction,
  NetworkRestartAction,
  NetworkEndRestartAction
} from 'actions/supervisor'
import { MASTER_BEDROOM_POWER_ROUTER, MASTER_BEDROOM_POWER_MODEM } from 'actions/master'
import { deltaToTimeMsec, epochPastmidnight, getCurrentEpoch } from 'helpers/helpers'
import {
  HOURS_24_IN_MSEC,
  MINUTES_1_IN_MSEC,
  MINUTES_2_IN_MSEC,
  MINUTES_5_IN_MSEC,
  NETWORK_NO_RESPONSE_TIMEOUT,
  SUNRISE_SUNSET_API
} from 'consts'
import type { PowerOff, PowerOn, Noop } from 'actions/mqttClient'
import type { SunriseSunsetResponse } from 'types/responses'
import type { RootState } from 'store'

type NetworkCheckEpicReturnType = Observable<NetworkCheckAction | SupervisorErrorAction | NetworkErrorAction>
const networkCheckEpic = (
  action$: Observable<SupervisorInitAction | NetworkEndRestartAction>
): NetworkCheckEpicReturnType => action$.pipe(
  ofType(SUPERVISOR_INIT, NETWORK_END_RESTART),
  switchMap(() => interval(1000 * 60 * 2).pipe(
    switchMap(() => fromFetch('https://google.com').pipe(
      switchMap((res, index) => {
        if (res.status === 200) {
          return of(networkCheck(getCurrentEpoch()))
        }
        return of(networkError())
      })
    )),
    catchError(_ => of(networkError()))
  )),
  catchError(err => of(supervisorError(err)))
)

type NetworkErrorEpicReturnType = Observable<NetworkRestartAction | NetworkEndRestartAction | PowerOff | PowerOn | Noop>
const networkErrorEpic = (
  action$: Observable<NetworkErrorAction>,
  state$: StateObservable<RootState>
): NetworkErrorEpicReturnType => action$.pipe(
  ofType(NETWORK_ERROR),
  switchMap(() => {
    const lastNetworkUpdate: number = state$.value.supervisorReducer.lastSuccessfulInternetCheck
    const currentRestarting: boolean = state$.value.supervisorReducer.networkRestart

    if ((getCurrentEpoch() - lastNetworkUpdate > NETWORK_NO_RESPONSE_TIMEOUT) && !currentRestarting) {
      return concat(
        of(networkRestart()),
        of(powerOff(MASTER_BEDROOM_POWER_ROUTER)),
        of(powerOff(MASTER_BEDROOM_POWER_MODEM)),
        timer(MINUTES_1_IN_MSEC).pipe(
          switchMap(() => concat(
            of(powerOn(MASTER_BEDROOM_POWER_MODEM)),
            timer(MINUTES_5_IN_MSEC).pipe(
              switchMap(() => concat(
                of(powerOn(MASTER_BEDROOM_POWER_ROUTER)),
                timer(MINUTES_2_IN_MSEC).pipe(
                  switchMap(() => of(networkEndRestart()))
                )
              ))
            )
          ))
        )
      )
    }

    return of(noop())
  })
)

/**
 * Queries sunrise-sunset API to determine when to send main light information
 *
 * @remarks This will query upon start, the delta to 3am, then every 3am after
 */
type SunriseSunsetEpicResponseType = Observable<SetSunriseSunsetAction | SupervisorErrorAction>
export const sunriseSunsetEpic = (
  action$: Observable<SupervisorInitAction>
): SunriseSunsetEpicResponseType => action$.pipe(
  ofType(SUPERVISOR_INIT),
  switchMap(() => fromFetch(
    `${SUNRISE_SUNSET_API}/json?lat=39.1097&lng=-95.0877&date=today&formatted=0`,
    { selector: async (res) => await res.json() }
  ).pipe(
    switchMap(({
      results: { sunrise, sunset, solar_noon: sn, civil_twilight_begin: ctb, civil_twilight_end: cte }
    }: SunriseSunsetResponse) => concat(
      of(setSunriseSunset(sunrise, sunset, sn, ctb, cte)),
      timer(deltaToTimeMsec(epochPastmidnight({ hours: 3 })), HOURS_24_IN_MSEC).pipe(
        switchMap(() => fromFetch(
          `${SUNRISE_SUNSET_API}/json?lat=39.1097&lng=-95.0877&date=today&formatted=0`,
          { selector: async (res) => await res.json() }
        ).pipe(
          map(({
            results: { sunrise, sunset, solar_noon: sn, civil_twilight_begin: ctb, civil_twilight_end: cte }
          }: SunriseSunsetResponse) => setSunriseSunset(sunrise, sunset, sn, ctb, cte))
        ))
      )
    ))
  ))
)

export default combineEpics(networkCheckEpic as any, networkErrorEpic as any, sunriseSunsetEpic as any)
