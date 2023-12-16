import { combineEpics, ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import type { Observable } from 'rxjs'
import type { StateObservable } from 'redux-observable'

import { IS_SUNRISE, NIGHT_MODE } from 'actions/supervisor'
import { KITCHEN_NIGHT_LIGHT } from 'actions/kitchen'
import { lightOn } from 'actions/mqttClient'
import { COLOR_RED_HEX, COLOR_TEMP_WARM } from 'consts'
import type { IsSunriseAction, NightModeAction } from 'actions/supervisor'
import type { LightOn } from 'actions/mqttClient'
import type { RootState } from 'store'

const kitchenSunriseEpic = (
  action$: Observable<IsSunriseAction>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(IS_SUNRISE),
  map(() => lightOn(KITCHEN_NIGHT_LIGHT, { brightness: 254, color_temp: COLOR_TEMP_WARM }))
)

const kitchenNightModeEpic = (
  action$: Observable<NightModeAction>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(NIGHT_MODE),
  map(() => lightOn(KITCHEN_NIGHT_LIGHT, { brightness: 70, color: { hex: COLOR_RED_HEX } }))
)

export default combineEpics(
  kitchenSunriseEpic as any,
  kitchenNightModeEpic as any
)
