import { concatMap, tap, map, catchError } from 'rxjs/operators'



const entitiesGet$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect(req$ => req$.pipe(
    concatMap(req => from(engine.all(GET_ALL_ENTITIES)).pipe(
      map((data: Entity[]) => ({ body: { data } }))
    )),
    catchError(err => of(err))
  ))
)

const entities$ = combineRoutes('/entity', [
  entitiesGet$
])

export default entities$
