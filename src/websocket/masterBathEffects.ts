import { matchEvent } from '@marblejs/core'
import { Subject, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import type { WsEffect } from '@marblejs/websockets'

import {
  MASTER_BATH_INIT,
  MASTER_BATH_UPDATE_PROFILE_MANUAL,
  MASTER_BATH_UPDATE_PROFILE_NORMAL,
  MASTER_BATH_UPDATE_PROFILE_SHOWER,
  wsUpdateState,
  wsNoop
} from 'websocket/translations'
import {
  MASTER_BATH_CHANGE_GROUP_RED_LIGHT,
  MASTER_BATH_CHANGE_GROUP_WHITE_LIGHT,
  MASTER_BATH_UPDATE_STATE,
  masterBathChangeGroupRedLight,
  masterBathChangeGroupWhiteLight,
  masterBathDisableManual,
  masterBathOverrideSensor,
  masterBathShowerTimer
} from 'actions/master'
import type { MasterBathUpdateStateAction } from 'actions/master'
import store from 'store'

type WebsocketUpdateStateAction = MasterBathUpdateStateAction
export const stateUpdateSubject = new Subject<WebsocketUpdateStateAction>()

export const init: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_INIT),
  switchMap(() => of(wsUpdateState(store.getState().masterReducer)))
)

export const updateState: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_INIT),
  switchMap(() => stateUpdateSubject.pipe(
    ofType(MASTER_BATH_UPDATE_STATE),
    map(() => wsUpdateState(store.getState().masterReducer))
  ))
)

export const changeRedLight: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_CHANGE_GROUP_RED_LIGHT),
  map(() => {
    store.dispatch(masterBathChangeGroupRedLight())
    return wsNoop()
  })
)

export const changeWhiteLight: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_CHANGE_GROUP_WHITE_LIGHT),
  map(() => {
    store.dispatch(masterBathChangeGroupWhiteLight())
    return wsNoop()
  })
)

export const masterBathNormal: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_UPDATE_PROFILE_NORMAL),
  map(() => {
    store.dispatch(masterBathDisableManual())
    return wsNoop()
  })
)

export const masterBathManual: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_UPDATE_PROFILE_MANUAL),
  map(() => {
    store.dispatch(masterBathOverrideSensor())
    return wsNoop()
  })
)

export const masterBathShower: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_UPDATE_PROFILE_SHOWER),
  map(() => {
    store.dispatch(masterBathShowerTimer())
    return wsNoop()
  })
)

export default [
  init,
  updateState,
  changeRedLight,
  changeWhiteLight,
  masterBathNormal,
  masterBathManual,
  masterBathShower
]
