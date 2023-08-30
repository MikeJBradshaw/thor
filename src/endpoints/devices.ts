import { combineRoutes, r } from '@marblejs/http'
import { of } from 'rxjs'
import { concatMap, tap } from 'rxjs/operators'
import { withDatabase } from 'helpers/rxjs'

import { GET_ALL_DEVICES } from 'sql'

const devicesGet$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect(req$ => req$.pipe(
    concatMap(() => withDatabase().pipe(
      concatMap(db => of(db.run(GET_ALL_DEVICES))),
      tap(console.log)
    ))
  ))
)

const devices$ = combineRoutes('/device', [
  devicesGet$
])

export default devices$
