import { matchEvent } from '@marblejs/core'
import { Subject, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import type { WsEffect } from '@marblejs/websockets'

import { UPDATE_STATE, UpdateStateAction } from 'actions/bedroomOne'
import { BEDROOM_ONE_INIT, wsUpdateBedroomOneState } from 'websocket/translations'
import store from 'store'

export const bedroomOneStateSubject = new Subject<UpdateStateAction>()

const init: WsEffect = event$ => event$.pipe(
  matchEvent(BEDROOM_ONE_INIT),
  switchMap(() => of(wsUpdateBedroomOneState(store.getState().bedroomOne)))
)

const updateState: WsEffect = event$ => event$.pipe(
  matchEvent(BEDROOM_ONE_INIT),
  switchMap(() => bedroomOneStateSubject.pipe(
    ofType(UPDATE_STATE),
    map(() => wsUpdateBedroomOneState(store.getState().bedroomOne))
  ))
)

export default [
  init,
  updateState
]
