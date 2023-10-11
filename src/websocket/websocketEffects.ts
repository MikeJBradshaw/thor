import { matchEvent } from '@marblejs/core'
import { concatMap, catchError, map } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { APP_INIT, updateEntities } from 'websocket/translations'
import type { WsEffect } from '@marblejs/websockets'

import { DBEngine } from 'database/engine'
import { GET_ALL_ENTITIES } from 'sql'
import type { Entity } from 'websocket/translations'
import config from '../../configuration.json'

const { type, fileName } = config.database
const engine = new DBEngine(type === 'file' ? fileName : ':memory:')

export const getEntities: WsEffect = event$ => event$.pipe(
  matchEvent(APP_INIT),
  concatMap(() => from(engine.all(GET_ALL_ENTITIES)).pipe(
    map((data: Entity[]) => updateEntities(data))
  )),
  catchError(err => {
    console.log('GET ENTITIES ERROR:', err.message)
    return of(err)
  })
)

export default [getEntities]
