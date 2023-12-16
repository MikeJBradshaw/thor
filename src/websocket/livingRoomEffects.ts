import { matchEvent } from '@marblejs/core'
// import { t, eventValidator$ } from '@marblejs/middleware-io'
import { Subject, of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import type { WsEffect } from '@marblejs/websockets'

import { LIVING_ROOM_INIT, wsAck, wsUpdateLivingRoomState } from 'websocket/translations'
import {
  UPDATE_PROFILE_DEFAULT,
  UPDATE_PROFILE_RAINBOW,
  UPDATE_STATE,
  updateProfileDefault,
  updateProfileRainbow
} from 'actions/livingRoom'
import type { UpdateStateAction } from 'actions/livingRoom'
import store from 'store'

type WebsocketUpdateStateAction = UpdateStateAction
export const stateUpdateSubject = new Subject<WebsocketUpdateStateAction>()

const init: WsEffect = event$ => event$.pipe(
  matchEvent(LIVING_ROOM_INIT),
  switchMap(() => of(wsUpdateLivingRoomState(store.getState().livingRoom)))
)

// const brightness: WsEffect = (event$, ...args) => event$.pipe(
//   matchEvent(UPDATE_BRIGHTNESS),
//   eventValidator$(t.number),
//   map(({ payload }) => {
//     store.dispatch(updateBrightness(+payload))
//     return wsAck()
//   }),
//   catchError(() => of(wsPayloadRejection()))
// )

const defaultProfile: WsEffect = event$ => event$.pipe(
  matchEvent(UPDATE_PROFILE_DEFAULT),
  map(() => {
    store.dispatch(updateProfileDefault())
    return wsAck()
  })
)

const rainbowProfile: WsEffect = event$ => event$.pipe(
  matchEvent(UPDATE_PROFILE_RAINBOW),
  map(() => {
    store.dispatch(updateProfileRainbow())
    return wsAck()
  })
)

const updateState: WsEffect = event$ => event$.pipe(
  matchEvent(LIVING_ROOM_INIT),
  switchMap(() => stateUpdateSubject.pipe(
    ofType(UPDATE_STATE),
    map(() => wsUpdateLivingRoomState(store.getState().livingRoom))
  ))
)

export default [
  init,
  // brightness,
  defaultProfile,
  rainbowProfile,
  updateState
]
