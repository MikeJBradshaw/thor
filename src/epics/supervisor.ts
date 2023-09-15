import { ofType, combineEpics } from 'redux-observable'
import { Observable, interval, of } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { fromFetch } from 'rxjs/fetch'
import type { StateObservable } from 'redux-observable'

import {
  SUPERVISOR_INIT,
  SUPERVISOR_NETWORK_ERROR,
  supervisorError,
  supervisorNetworkCheck,
  supervisorNetworkError
} from 'actions/supervisor'
import { powerOn, powerOff, noop } from 'actions/mqttClient'
import type {
  SupervisorErrorAction,
  SupervisorInitAction,
  SupervisorNetworkCheckAction,
  SupervisorNetworkErrorAction
} from 'actions/supervisor'
import type { PowerOff, PowerOn, Noop } from 'actions/mqttClient'
import type { RootState } from 'store'

const NETWORK_NO_RESPONSE_TIMEOUT = 1000 * 60 * 5

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
      console.log('network response timeout')
      return of(noop())
    }
    console.log('not network reponse timeout')
    return of(noop())
  })
)

export default combineEpics(networkCheckEpic as any, networkErrorEpic as any)
