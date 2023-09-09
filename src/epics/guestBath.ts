import { Observable, of, interval } from 'rxjs'
import { switchMap, takeUntil, map } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import {
  GUEST_BATH_BUTTON_CLICK,
  GUEST_BATH_BUTTON_HOLD,
  GUEST_BATH_BUTTON_RELEASE,
  GUEST_BATH_LIGHTS_GROUP,
  GUEST_BATH_MOTION_SENSOR
} from 'actions/guestBath'
import { lightOnPublish, noop } from 'actions/mqttClient'
import { ROOM_STATE_DEFAULT, ROOM_STATE_DOUBLE, ROOM_STATE_SINGLE, RAINBOW_COLORS, COLOR_RED_HEX } from 'consts'
import type { RootState } from 'store'
import type {
  GuestBathButtonClickAction,
  GuestBathButtonHoldAction,
  GuestBathButtonReleaseAction,
  GuestBathMotionSensorAction
} from 'actions/guestBath'
import type { LightOnPublish, Noop } from 'actions/mqttClient'

const BRIGHTNESS_HIGH = 255
const BRIGHTNESS_LOW = 15
const BRIGHTNESS_OFF = 0
const DAY_END = '20:30:00'
const DAY_START = '06:45:00'

const isNight = (date: string): boolean => date >= DAY_END || date <= DAY_START

type MotionSensorEpicReturnType = Observable<LightOnPublish | Noop>
const motionSensorEpic = (
  action$: Observable<GuestBathMotionSensorAction>,
  state$: StateObservable<RootState>
): MotionSensorEpicReturnType => action$.pipe(
  ofType(GUEST_BATH_MOTION_SENSOR),
  switchMap(({ payload: { occupancy } }) => {
    if (
      state$.value.guestBathReducer.overrideGuestBathLights ||
      state$.value.guestBathReducer.overrideGuestBathMotionSensor
    ) {
      return of(noop())
    } else {
      if (occupancy) {
        const date = new Date().toLocaleTimeString('en', { hour12: false })

        if (isNight(date)) {
          return of(
            lightOnPublish(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_LOW, color: { hex: COLOR_RED_HEX } })
          )
        }

        return of(lightOnPublish(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: 'neutral' }))
      }

      return of(lightOnPublish(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_OFF, color_temp: 'neutral' }))
    }
  })
)

type ButtonHoldEpicReturnType = Observable<LightOnPublish>
const buttonHoldEpic = (
  action$: Observable<GuestBathButtonHoldAction>,
  state$: StateObservable<RootState>
): ButtonHoldEpicReturnType => action$.pipe(
  ofType(GUEST_BATH_BUTTON_HOLD),
  switchMap(() => of(lightOnPublish(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: 'neutral' })))
)

type ButtonReleaseEpicReturnType = Observable<LightOnPublish>
const buttonReleaseEpic = (
  action$: Observable<GuestBathButtonReleaseAction>,
  state$: StateObservable<RootState>
): ButtonReleaseEpicReturnType => action$.pipe(
  ofType(GUEST_BATH_BUTTON_RELEASE),
  switchMap(() => {
    const date = new Date().toLocaleTimeString('en', { hour12: false })

    if (isNight(date)) {
      return of(lightOnPublish(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_LOW, color: { hex: COLOR_RED_HEX } }))
    }

    return of(lightOnPublish(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: 'neutral' }))
  })
)

type ButtonClickEpicReturnType = Observable<LightOnPublish | Noop>
const buttonClickEpic = (
  action$: Observable<GuestBathButtonClickAction | GuestBathButtonHoldAction>,
  state$: StateObservable<RootState>
): ButtonClickEpicReturnType => action$.pipe(
  ofType(GUEST_BATH_BUTTON_CLICK),
  switchMap(() => {
    const buttonAction = state$.value.guestBathReducer.buttonState.action
    if (buttonAction === ROOM_STATE_SINGLE) {
      return of(lightOnPublish(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: 'neutral' }))
    }

    if (buttonAction === ROOM_STATE_DOUBLE) {
      return interval(1250).pipe(
        switchMap(val => of(lightOnPublish(
          GUEST_BATH_LIGHTS_GROUP,
          {
            brightness: 255,
            color: { hex: RAINBOW_COLORS[val % 7] },
            transition: 1
          }
        ))),
        takeUntil(action$.pipe(ofType(GUEST_BATH_BUTTON_CLICK, GUEST_BATH_BUTTON_HOLD)))
      )
    }

    if (buttonAction === ROOM_STATE_DEFAULT) {
      const date = new Date().toLocaleTimeString('en', { hour12: false })

      if (isNight(date)) {
        return of(
          lightOnPublish(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_LOW, color: { hex: COLOR_RED_HEX } })
        )
      }

      return of(lightOnPublish(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: 'neutral' }))
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
