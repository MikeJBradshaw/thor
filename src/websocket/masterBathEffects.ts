import { matchEvent } from '@marblejs/core'
import { t, eventValidator$ } from '@marblejs/middleware-io'
import { Subject, of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import type { WsEffect } from '@marblejs/websockets'

import {
  MASTER_BATH_INIT,
  MASTER_BATH_UPDATE_PROFILE_MANUAL,
  MASTER_BATH_UPDATE_PROFILE_SENSOR,
  MASTER_BATH_UPDATE_PROFILE_SHOWER,
  wsAck,
  wsPayloadRejection,
  wsUpdateMasterBathState
} from 'websocket/translations'
import {
  CHANGE_GROUP_RED_LIGHT,
  CHANGE_GROUP_WHITE_LIGHT,
  UPDATE_BRIGHTNESS,
  UPDATE_STATE,
  changeGroupRedLight,
  changeGroupWhiteLight,
  updateBrightness,
  updateManualProfile,
  updateSensorProfile,
  updateShowerTimer
} from 'actions/master'
import type { UpdateStateAction } from 'actions/master'
import store from 'store'

type WebsocketUpdateStateAction = UpdateStateAction
export const stateUpdateSubject = new Subject<WebsocketUpdateStateAction>()

const init: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_INIT),
  switchMap(() => of(wsUpdateMasterBathState(store.getState().masterBath)))
)

const brightness: WsEffect = (event$, ...args) => event$.pipe(
  matchEvent(UPDATE_BRIGHTNESS),
  eventValidator$(t.number),
  map(({ payload }) => {
    store.dispatch(updateBrightness(+payload))
    return wsAck()
  }),
  catchError(() => of(wsPayloadRejection()))
)

const changeRedLight: WsEffect = event$ => event$.pipe(
  matchEvent(CHANGE_GROUP_RED_LIGHT),
  map(() => {
    store.dispatch(changeGroupRedLight())
    return wsAck()
  })
)

const changeWhiteLight: WsEffect = event$ => event$.pipe(
  matchEvent(CHANGE_GROUP_WHITE_LIGHT),
  map(() => {
    store.dispatch(changeGroupWhiteLight())
    return wsAck()
  })
)

const manualProfile: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_UPDATE_PROFILE_MANUAL),
  map(() => {
    store.dispatch(updateManualProfile())
    return wsAck()
  })
)

const sensorProfile: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_UPDATE_PROFILE_SENSOR),
  map(() => {
    store.dispatch(updateSensorProfile())
    return wsAck()
  })
)

const showerProfile: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_UPDATE_PROFILE_SHOWER),
  map(() => {
    store.dispatch(updateShowerTimer())
    return wsAck()
  })
)

const updateState: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_INIT),
  switchMap(() => stateUpdateSubject.pipe(
    ofType(UPDATE_STATE),
    map(() => wsUpdateMasterBathState(store.getState().masterBath))
  ))
)

export default [
  init,
  brightness,
  changeRedLight,
  changeWhiteLight,
  manualProfile,
  sensorProfile,
  showerProfile,
  updateState
]
