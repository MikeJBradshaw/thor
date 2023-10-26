import { matchEvent } from '@marblejs/core'
import { t, eventValidator$ } from '@marblejs/middleware-io'
import { Subject, of } from 'rxjs'
import { map, switchMap, catchError } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import type { WsEffect } from '@marblejs/websockets'

import {
  UPDATE_STATE,
  UPDATE_BRIGHTNESS,
  UPDATE_POWER_OFF,
  UPDATE_POWER_ON,
  UPDATE_PROFILE_BRIGHT,
  UPDATE_PROFILE_COLORS,
  UPDATE_PROFILE_DEFAULT,
  UPDATE_PROFILE_SLEEP,
  UPDATE_RED_LIGHT_ON,
  UPDATE_WHITE_LIGHT_ON,
  updateBrightness,
  updatePowerOff,
  updatePowerOn,
  updateProfileBright,
  updateProfileColors,
  updateProfileDefault,
  updateProfileSleep,
  updateRedLightOn,
  updateWhiteLightOn
} from 'actions/bedroomOne'
import { BEDROOM_ONE_INIT, wsUpdateBedroomOneState, wsAck, wsPayloadRejection } from 'websocket/translations'
import type { UpdateStateAction } from 'actions/bedroomOne'
import store from 'store'

export const bedroomOneStateSubject = new Subject<UpdateStateAction>()

const init: WsEffect = event$ => event$.pipe(
  matchEvent(BEDROOM_ONE_INIT),
  switchMap(() => of(wsUpdateBedroomOneState(store.getState().bedroomOne)))
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
const brightnessProfile: WsEffect = event$ => event$.pipe(
  matchEvent(UPDATE_PROFILE_BRIGHT),
  map(() => {
    store.dispatch(updateProfileBright())
    return wsAck()
  })
)

const colorsProfile: WsEffect = event$ => event$.pipe(
  matchEvent(UPDATE_PROFILE_COLORS),
  map(() => {
    store.dispatch(updateProfileColors())
    return wsAck()
  })
)

const defaultProfile: WsEffect = event$ => event$.pipe(
  matchEvent(UPDATE_PROFILE_DEFAULT),
  map(() => {
    store.dispatch(updateProfileDefault())
    return wsAck()
  })
)

const powerOff: WsEffect = event$ => event$.pipe(
  matchEvent(UPDATE_POWER_OFF),
  map(() => {
    store.dispatch(updatePowerOff())
    return wsAck()
  })
)

const powerOn: WsEffect = event$ => event$.pipe(
  matchEvent(UPDATE_POWER_ON),
  map(() => {
    store.dispatch(updatePowerOn())
    return wsAck()
  })
)

const redLightOn: WsEffect = event$ => event$.pipe(
  matchEvent(UPDATE_RED_LIGHT_ON),
  map(() => {
    store.dispatch(updateRedLightOn())
    return wsAck()
  })
)

const sleepProfile: WsEffect = event$ => event$.pipe(
  matchEvent(UPDATE_PROFILE_SLEEP),
  map(() => {
    store.dispatch(updateProfileSleep())
    return wsAck()
  })
)

const whiteLightOn: WsEffect = event$ => event$.pipe(
  matchEvent(UPDATE_WHITE_LIGHT_ON),
  map(() => {
    store.dispatch(updateWhiteLightOn())
    return wsAck()
  })
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
  brightness,
  brightnessProfile,
  colorsProfile,
  defaultProfile,
  redLightOn,
  sleepProfile,
  powerOff,
  powerOn,
  whiteLightOn,
  updateState
]
