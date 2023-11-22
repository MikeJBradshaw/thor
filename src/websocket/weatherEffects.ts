import { matchEvent } from '@marblejs/core'
import { ofType } from 'redux-observable'
import { Subject, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import type { WsEffect } from '@marblejs/websockets'

import { WEATHER_INIT, wsUpdateWeatherState } from 'websocket/translations'
import type { UpdateStateAction } from 'actions/weather'
import { UPDATE_STATE } from 'actions/weather'
import store from 'store'

type WebsocketUpdateStateAction = UpdateStateAction
export const stateUpdateSubject = new Subject<WebsocketUpdateStateAction>()

const init: WsEffect = event$ => event$.pipe(
  matchEvent(WEATHER_INIT),
  switchMap(() => of(wsUpdateWeatherState(store.getState().weather)))
)

const updateState: WsEffect = event$ => event$.pipe(
  matchEvent(WEATHER_INIT),
  switchMap(() => stateUpdateSubject.pipe(
    ofType(UPDATE_STATE),
    map(() => wsUpdateWeatherState(store.getState().weather))
  ))
)

export default [init, updateState]
