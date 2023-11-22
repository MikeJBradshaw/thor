import { Observable, of, interval } from 'rxjs'
import { switchMap, takeUntil } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import {
  GUEST_BATH_BUTTON_CLICK,
  GUEST_BATH_BUTTON_HOLD,
  GUEST_BATH_BUTTON_RELEASE,
  GUEST_BATH_LIGHTS_GROUP,
  GUEST_BATH_MOTION_SENSOR
} from 'actions/guestBath'
import { lightOn, lightOff, noop } from 'actions/mqttClient'
import {
  BRIGHTNESS_HIGH,
  BRIGHTNESS_LOW,
  ROOM_STATE_DEFAULT,
  ROOM_STATE_DOUBLE,
  ROOM_STATE_SINGLE,
  RAINBOW_COLORS,
  COLOR_RED_HEX,
  COLOR_TEMP_NEUTRAL
} from 'consts'
import type { RootState } from 'store'
import type {
  GuestBathButtonClickAction,
  GuestBathButtonHoldAction,
  GuestBathButtonReleaseAction,
  GuestBathMotionSensorAction
} from 'actions/guestBath'
import type { LightOn, LightOff, Noop } from 'actions/mqttClient'

const DAY_END = '20:30:00'
const DAY_START = '06:45:00'

const isNight = (date: string): boolean => date >= DAY_END || date <= DAY_START

type MotionSensorEpicReturnType = Observable<LightOn | LightOff | Noop>
const motionSensorEpic = (
  action$: Observable<GuestBathMotionSensorAction>,
  state$: StateObservable<RootState>
): MotionSensorEpicReturnType => action$.pipe(
  ofType(GUEST_BATH_MOTION_SENSOR),
  switchMap(({ payload: { occupancy } }) => {
    if (
      state$.value.guestBath.overrideGuestBathLights ||
      state$.value.guestBath.overrideGuestBathMotionSensor
    ) {
      return of(noop())
    } else {
      if (occupancy) {
        const date = new Date().toLocaleTimeString('en', { hour12: false })

        if (isNight(date)) {
          return of(
            lightOn(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_LOW, color: { hex: COLOR_RED_HEX } })
          )
        }

        return of(lightOn(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: COLOR_TEMP_NEUTRAL }))
      }

      return of(lightOff(GUEST_BATH_LIGHTS_GROUP))
    }
  })
)

type ButtonHoldEpicReturnType = Observable<LightOn>
const buttonHoldEpic = (
  action$: Observable<GuestBathButtonHoldAction>,
  state$: StateObservable<RootState>
): ButtonHoldEpicReturnType => action$.pipe(
  ofType(GUEST_BATH_BUTTON_HOLD),
  switchMap(() => of(lightOn(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: COLOR_TEMP_NEUTRAL })))
)

type ButtonReleaseEpicReturnType = Observable<LightOn>
const buttonReleaseEpic = (
  action$: Observable<GuestBathButtonReleaseAction>,
  state$: StateObservable<RootState>
): ButtonReleaseEpicReturnType => action$.pipe(
  ofType(GUEST_BATH_BUTTON_RELEASE),
  switchMap(() => {
    const date = new Date().toLocaleTimeString('en', { hour12: false })

    if (isNight(date)) {
      return of(lightOn(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_LOW, color: { hex: COLOR_RED_HEX } }))
    }

    return of(lightOn(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: COLOR_TEMP_NEUTRAL }))
  })
)

type ButtonClickEpicReturnType = Observable<LightOn | Noop>
const buttonClickEpic = (
  action$: Observable<GuestBathButtonClickAction | GuestBathButtonHoldAction>,
  state$: StateObservable<RootState>
): ButtonClickEpicReturnType => action$.pipe(
  ofType(GUEST_BATH_BUTTON_CLICK),
  switchMap(() => {
    const buttonAction = state$.value.guestBath.buttonState.action
    if (buttonAction === ROOM_STATE_SINGLE) {
      return of(lightOn(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: COLOR_TEMP_NEUTRAL }))
    }

    if (buttonAction === ROOM_STATE_DOUBLE) {
      return interval(1250).pipe(
        switchMap(val => of(lightOn(
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
          lightOn(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_LOW, color: { hex: COLOR_RED_HEX } })
        )
      }

      return of(lightOn(GUEST_BATH_LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: COLOR_TEMP_NEUTRAL }))
    }

    return of(noop())
  })
)

export default combineEpics(
  buttonClickEpic as any,
  buttonHoldEpic as any,
  buttonReleaseEpic as any,
  motionSensorEpic as any
)
