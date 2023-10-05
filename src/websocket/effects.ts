import { matchEvent } from '@marblejs/core'
import { from, of } from 'rxjs'
import { catchError, concatMap, map } from 'rxjs/operators'
import type { WsEffect } from '@marblejs/websockets'

import {
  APP_INIT,
  MASTER_BATH_UPDATE_PROFILE_MANUAL,
  MASTER_BATH_UPDATE_PROFILE_NORMAL,
  MASTER_BATH_UPDATE_PROFILE_SHOWER,
  updateEntities,
  wsNoop
} from 'websocket/events'
import {
  MASTER_BATH_CHANGE_GROUP_RED_LIGHT,
  MASTER_BATH_CHANGE_GROUP_WHITE_LIGHT,
  masterBathChangeGroupRedLight,
  masterBathChangeGroupWhiteLight,
  masterBathDisableManual,
  masterBathOverrideSensor,
  MasterBathShowerTimerAction,
  masterBathShowerTimer,
  MASTER_BATH_OVERRIDE_SENSOR,
} from 'actions/master'
import { DBEngine } from 'database/engine'
import { GET_ALL_ENTITIES } from 'sql'
import type { Entity } from 'websocket/events'
import store from 'store'
import config from 'configuration.json'

const { type, fileName } = config.database
const engine = new DBEngine(type === 'file' ? fileName : ':memory:')

export const getEntities: WsEffect = event$ => event$.pipe(
  matchEvent(APP_INIT),
  concatMap(() => from(engine.all(GET_ALL_ENTITIES)).pipe(map((data: Entity[]) => updateEntities(data)))),
  catchError(err => {
    console.log('ERROR:', err.message)
    return of(err)
  })
)

export const masterBathChangeRedLight: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_CHANGE_GROUP_RED_LIGHT),
  map(() => {
    store.dispatch(masterBathChangeGroupRedLight())
    return wsNoop()
  })
)

export const masterBathChangeWhiteLight: WsEffect = event$ => event$.pipe(
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
