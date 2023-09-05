import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import { MOTION_SENSOR, LAUNDRY_LIGHTS } from 'actions/laundry'
import { lightOnPublish, noop } from 'actions/mqttPublishClient'
import type { RootState } from 'store'
import type { MotionSensorAction } from 'actions/laundry'
import type { LightOnPublish, Noop } from 'actions/mqttPublishClient'

const BRIGHTNESS_HIGH = 255
const BRIGHTNESS_OFF = 0

type MotionSensorEpicReturnType = Observable<LightOnPublish | Noop>
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
          lightOnPublish(LAUNDRY_LIGHTS[0], { brightness: BRIGHTNESS_HIGH }),
          lightOnPublish(LAUNDRY_LIGHTS[1], { brightness: BRIGHTNESS_HIGH })
        )
      }
      return of(
        lightOnPublish(LAUNDRY_LIGHTS[0], { brightness: BRIGHTNESS_OFF }),
        lightOnPublish(LAUNDRY_LIGHTS[1], { brightness: BRIGHTNESS_OFF })
      )
    }
  })
)

export default combineEpics(motionSensorEpic as any)
