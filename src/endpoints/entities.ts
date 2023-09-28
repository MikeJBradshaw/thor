import { combineRoutes, r } from '@marblejs/http'
import { from, of } from 'rxjs'
import { concatMap, tap, map, catchError } from 'rxjs/operators'

import { GET_ALL_ENTITIES } from 'sql'
import { DBEngine } from 'database/engine'
import config from 'configuration.json'

const { type, fileName } = config.database
const engine = new DBEngine(type === 'file' ? fileName : ':memory:')

interface Entity {
  id: number
  name: string
  key: string
}

const entitiesGet$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect(req$ => req$.pipe(
    concatMap(req => from(engine.all(GET_ALL_ENTITIES)).pipe(
      tap(console.log),
      map((data: Entity[]) => ({ body: { data } }))
    )),
    catchError(err => of(err))
  ))
)

const entities$ = combineRoutes('/entity', [
  entitiesGet$
])

export default entities$
