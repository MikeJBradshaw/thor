import { combineRoutes, r } from '@marblejs/http'
import { from, of } from 'rxjs'
import { concatMap, tap, map, catchError } from 'rxjs/operators'

import { GET_ALL_DEVICES } from 'sql'
import { DBEngine } from 'database/engine'
import config from 'configuration.json'

const { type, fileName } = config.database
const engine = new DBEngine(type === 'file' ? fileName : ':memory:')

interface Device {
  id: number
  friendly_name: string
}

const devicesGet$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect(req$ => req$.pipe(
    concatMap(req => from(engine.all(GET_ALL_DEVICES)).pipe(
      tap(console.log),
      map((data: Device[]) => ({ body: { data } }))
    )),
    catchError(err => of(err))
  ))
)

const devices$ = combineRoutes('/device', [
  devicesGet$
])

export default devices$
