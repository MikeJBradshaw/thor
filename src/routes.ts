import { combineRoutes } from '@marblejs/http'

import devices$ from 'endpoints/devices'
import entities$ from 'endpoints/entities'

const v1$ = combineRoutes('/api/v1', [
  devices$,
  entities$
])

export default v1$
