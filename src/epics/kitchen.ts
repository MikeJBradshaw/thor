import { combineEpics, ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import type { Observable } from 'rxjs'
import type { StateObservable } from 'redux-observable'

import { NIGHT_MODE } from 'actions/supervisor'
import { KITCHEN_NIGHT_LIGHT } from 'actions/kitchen'
import { lightOn } from 'actions/mqttClient'
import { COLOR_RED_HEX } from 'consts'
import type { NightModeAction } from 'actions/supervisor'
import type { LightOn } from 'actions/mqttClient'
import type { RootState } from 'store'

const kitchenBedtimeEpic = (
  action$: Observable<NightModeAction>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(NIGHT_MODE),
  map(() => lightOn(KITCHEN_NIGHT_LIGHT, { brightness: 10, color: { hex: COLOR_RED_HEX } }))
)

export default combineEpics(kitchenBedtimeEpic as any)
