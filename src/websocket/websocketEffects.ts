import { matchEvent } from '@marblejs/core'
import { concatMap, catchError, map, repeat, switchMap, takeUntil } from 'rxjs/operators'
import { from, of, timer } from 'rxjs'
import type { WsEffect } from '@marblejs/websockets'

// import { DBEngine } from 'database/engine'
// import { GET_ALL_ENTITIES } from 'sql'
import { APP_INIT, CLIENT_HEARTBEAT, wsUpdateEntities, wsHeartbeat } from 'websocket/translations'
import { MINUTES_10_IN_MSEC, FRONT_END_SUPPORTED_ENTITIES } from 'consts'
// import type { Entity } from 'websocket/translations'
// import config from '../../configuration.json'

// const { type, fileName } = config.database
// const engine = new DBEngine(type === 'file' ? fileName : ':memory:')

export const getEntities: WsEffect = event$ => event$.pipe(
  matchEvent(APP_INIT),
  // concatMap(() => from(engine.all(GET_ALL_ENTITIES)).pipe(
  //   map((data: Entity[]) => wsUpdateEntities(data))
  // )),
  // catchError(err => {
  //   console.log('GET ENTITIES ERROR:', err.message)
  //   return of(err)
  // })
  map(() => wsUpdateEntities(
    FRONT_END_SUPPORTED_ENTITIES.map((entity, index) => ({
      id: index,
      name: entity.replace('-', ' ').toUpperCase(),
      key: entity
    }))
  ))
)

export const heartbeat: WsEffect = event$ => event$.pipe(
  matchEvent(CLIENT_HEARTBEAT),
  switchMap(() => timer(MINUTES_10_IN_MSEC).pipe(
    map(() => wsHeartbeat()),
    takeUntil(event$.pipe(matchEvent(CLIENT_HEARTBEAT))),
    repeat()
  ))
)

export default [getEntities, heartbeat]
