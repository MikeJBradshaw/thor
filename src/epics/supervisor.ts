import { ofType, combineEpics } from 'redux-observable'
import { Observable, interval, of, timer, concat } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { fromFetch } from 'rxjs/fetch'
import type { StateObservable } from 'redux-observable'

import {
  SUPERVISOR_INIT,
  NETWORK_ERROR,
  NETWORK_END_RESTART,
  SET_SUNRISE_SUNSET,
  isSunrise,
  homeLowEnergy,
  networkCheck,
  networkError,
  networkRestart,
  networkEndRestart,
  nightMode,
  setSunriseSunset,
  supervisorError
} from 'actions/supervisor'
import { powerOn, powerOff, noop } from 'actions/mqttClient'
import type {
  HomeLowEnergyAction,
  // HomeEveningModeAction,
  IsSunriseAction,
  NetworkCheckAction,
  NetworkErrorAction,
  NetworkRestartAction,
  NetworkEndRestartAction,
  NightModeAction,
  SetSunriseSunsetAction,
  SupervisorErrorAction,
  SupervisorInitAction
} from 'actions/supervisor'
import { MASTER_BEDROOM_POWER_ROUTER, MASTER_BEDROOM_POWER_MODEM } from 'actions/master'
import { deltaToTimeMsec, epochPastmidnight, epochUntilmidnight, getCurrentEpoch } from 'helpers/helpers'
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
    const lastNetworkUpdate: number = state$.value.supervisor.lastSuccessfulInternetCheck
    const currentRestarting: boolean = state$.value.supervisor.networkRestart

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
const sunriseSunsetEpic = (
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

const lowEnergyStateEpic = (
  action$: Observable<SupervisorInitAction>
): Observable<HomeLowEnergyAction> => action$.pipe(
  ofType(SUPERVISOR_INIT),
  switchMap(() => timer(deltaToTimeMsec(epochPastmidnight({ hours: 2, minutes: 30 })), HOURS_24_IN_MSEC).pipe(
    map(() => homeLowEnergy())
  ))
)

/*****************
 * System alert for sunset - this alert fires 30 min before sunset so that the systems can take any actions needed
 * ***************/
// const sunsetEpic = (
//   action$: Observable<SetSunriseSunsetAction>,
//   state$: StateObservable<RootState>
// ): Observable<HomeEveningModeAction> => action$.pipe(
//   ofType(SET_SUNRISE_SUNSET),
//   switchMap(() => timer(deltaToTimeMsec(state$.value.supervisor.sunData.sunset + MINUTES_30_IN_MSEC)).pipe(
//     map(() => )
//   ))
// )

const sunriseEpic = (
  action$: Observable<SetSunriseSunsetAction>,
  state$: StateObservable<RootState>
): Observable<IsSunriseAction> => action$.pipe(
  ofType(SET_SUNRISE_SUNSET),
  switchMap(() => timer(deltaToTimeMsec(state$.value.supervisor.sunData.sunrise)).pipe(
    map(() => isSunrise())
  ))
)

const nightModeEpic = (action$: Observable<SupervisorInitAction>): Observable<NightModeAction> => action$.pipe(
  ofType(SUPERVISOR_INIT),
  switchMap(() => timer(deltaToTimeMsec(epochUntilmidnight({ hours: 2 })), HOURS_24_IN_MSEC).pipe(
    map(() => nightMode())
  ))
)

export default combineEpics(
  lowEnergyStateEpic as any,
  networkCheckEpic as any,
  networkErrorEpic as any,
  nightModeEpic as any,
  sunriseSunsetEpic as any,
  sunriseEpic as any
)
