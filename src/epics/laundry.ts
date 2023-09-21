import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import { MOTION_SENSOR, LAUNDRY_LIGHTS_GROUP } from 'actions/laundry'
import { lightOn, lightOff, noop } from 'actions/mqttClient'
import { BRIGHTNESS_HIGH } from 'consts'
import type { RootState } from 'store'
import type { MotionSensorAction } from 'actions/laundry'
import type { LightOn, LightOff, Noop } from 'actions/mqttClient'

type MotionSensorEpicReturnType = Observable<LightOn | LightOff | Noop>
const motionSensorEpic = (
  action$: Observable<MotionSensorAction>,
  state$: StateObservable<RootState>
): MotionSensorEpicReturnType => action$.pipe(
  ofType(MOTION_SENSOR),
  switchMap(({ payload: { occupancy } }) => {
    if (state$.value.laundryReducer.overrideLights) {
      return of(noop())
    } else {
      if (occupancy) {
        return of(
          lightOn(LAUNDRY_LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH })
        )
      }
      return of(
        lightOff(LAUNDRY_LIGHTS_GROUP)
      )
    }
  })
)

export default combineEpics(motionSensorEpic as any)
