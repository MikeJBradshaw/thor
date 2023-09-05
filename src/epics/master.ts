import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import { MASTER_BATH_LIGHTS, MASTER_BATH_MOTION_SENSOR } from 'actions/master'
import { lightOnPublish, noop } from 'actions/mqttPublishClient'
import type { RootState } from 'store'
import type { MasterBathMotionSensorAction } from 'actions/master'
import type { LightOnPublish, Noop } from 'actions/mqttPublishClient'

const BRIGHTNESS_HIGH = 255
const BRIGHTNESS_LOW = 15
const BRIGHTNESS_OFF = 0
const RED = '#FF0000'
const DAY_END = '21:00:00'
const DAY_START = '06:45:00'

const isNight = (date: string): boolean => date >= DAY_END || date <= DAY_START

type MotionSensorEpicReturnType = Observable<LightOnPublish | Noop>
const motionSensorEpic = (
  action$: Observable<MasterBathMotionSensorAction>,
  state$: StateObservable<RootState>
): MotionSensorEpicReturnType => action$.pipe(
  ofType(MASTER_BATH_MOTION_SENSOR),
  switchMap(({ payload: { occupancy } }) => {
    if (
      state$.value.masterReducer.overrideMasterBathLights ||
      state$.value.masterReducer.overrideMasterBathMotionSensor
    ) {
      return of(noop())
    } else {
      if (occupancy) {
        const date = new Date().toLocaleTimeString('en', { hour12: false })

        if (isNight(date)) {
          return of(
            lightOnPublish(MASTER_BATH_LIGHTS[0], { brightness: BRIGHTNESS_LOW, color: { hex: RED } }),
            lightOnPublish(MASTER_BATH_LIGHTS[1], { brightness: BRIGHTNESS_LOW, color: { hex: RED } })
          )
        }
        return of(
          lightOnPublish(MASTER_BATH_LIGHTS[0], { brightness: BRIGHTNESS_HIGH, color_temp: 'neutral' }),
          lightOnPublish(MASTER_BATH_LIGHTS[1], { brightness: BRIGHTNESS_HIGH, color_temp: 'neutral' })
        )
      }

      return of(
        lightOnPublish(MASTER_BATH_LIGHTS[0], { brightness: BRIGHTNESS_OFF, color_temp: 'neutral' }),
        lightOnPublish(MASTER_BATH_LIGHTS[1], { brightness: BRIGHTNESS_OFF, color_temp: 'neutral' })
      )
    }
  })
)

export default combineEpics(motionSensorEpic as any)
