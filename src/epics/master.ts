import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import {
  MASTER_BATH_LIGHTS,
  MASTER_BATH_BUTTON_CLICK,
  MASTER_BATH_BUTTON_HOLD,
  MASTER_BATH_BUTTON_RELEASE,
  MASTER_BATH_MOTION_SENSOR
} from 'actions/master'
import { lightOnPublish, noop } from 'actions/mqttClient'
import { ButtonState } from 'payloads'
import type { RootState } from 'store'
import type {
  MasterBathButtonClickAction,
  MasterBathButtonHoldAction,
  MasterBathButtonReleaseAction,
  MasterBathMotionSensorAction
} from 'actions/master'
import type { LightOnPublish, Noop } from 'actions/mqttClient'

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

type ButtonHoldEpicReturnType = Observable<LightOnPublish>
const buttonHoldEpic = (
  action$: Observable<MasterBathButtonHoldAction>,
  state$: StateObservable<RootState>
): ButtonHoldEpicReturnType => action$.pipe(
  ofType(MASTER_BATH_BUTTON_HOLD),
  switchMap(() => of(
    lightOnPublish(MASTER_BATH_LIGHTS[0], { brightness: BRIGHTNESS_HIGH, color_temp: 'neutral' }),
    lightOnPublish(MASTER_BATH_LIGHTS[1], { brightness: BRIGHTNESS_HIGH, color_temp: 'neutral' })
  ))
)

type ButtonReleaseEpicReturnType = Observable<LightOnPublish>
const buttonReleaseEpic = (
  action$: Observable<MasterBathButtonReleaseAction>,
  state$: StateObservable<RootState>
): ButtonReleaseEpicReturnType => action$.pipe(
  ofType(MASTER_BATH_BUTTON_RELEASE),
  switchMap(() => {
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
  })
)

type ButtonClickEpicReturnType = Observable<LightOnPublish | Noop>
const buttonClickEpic = (
  action$: Observable<MasterBathButtonClickAction>,
  state$: StateObservable<RootState>
): ButtonClickEpicReturnType => action$.pipe(
  ofType(MASTER_BATH_BUTTON_CLICK),
  switchMap(() => {
    const buttonAction = state$.value.masterReducer.buttonState.action
    if (buttonAction === ButtonState.Single) {
      return of(
        lightOnPublish(MASTER_BATH_LIGHTS[0], { brightness: BRIGHTNESS_HIGH, color_temp: 'neutral' }),
        lightOnPublish(MASTER_BATH_LIGHTS[1], { brightness: BRIGHTNESS_HIGH, color_temp: 'neutral' })
      )
    }

    if (buttonAction === ButtonState.Default) {
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

    // we dont handle double click right now
    return of(noop())
  })
)

export default combineEpics(
  buttonClickEpic as any,
  buttonHoldEpic as any,
  buttonReleaseEpic as any,
  motionSensorEpic as any
)
