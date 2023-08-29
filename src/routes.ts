import { combineRoutes, r } from '@marblejs/http'
import { mapTo } from 'rxjs/operators'

const root$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect(req$ => req$.pipe(
    mapTo({ body: 'Hello, from root bitch!' })
  ))
)

const foo$ = r.pipe(
  r.matchPath('/foo'),
  r.matchType('GET'),
  r.useEffect(req$ => req$.pipe(
    mapTo({ body: 'Hello, from foo leprecon!' })
  ))
)

const all$ = combineRoutes('/api/v1', [
  root$,
  foo$
])

export default all$
