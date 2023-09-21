import { Observable, of, timer } from 'rxjs'
import { switchMap, map, takeUntil } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import {
  LIGHTS_GROUP,
  MASTER_BATH_BUTTON_CLICK,
  MASTER_BATH_BUTTON_HOLD,
  MASTER_BATH_BUTTON_RELEASE,
  MASTER_BATH_MOTION_SENSOR,
  MASTER_BATH_TIMER,
  masterBathTimer,
  masterBathTimerExpire
} from 'actions/master'
import { lightOn, lightOff, noop } from 'actions/mqttClient'
import {
  BRIGHTNESS_HIGH,
  BRIGHTNESS_LOW,
  BUTTON_STATE_SINGLE,
  COLOR_TEMP_NEUTRAL,
  COLOR_RED_HEX,
  ROOM_STATE_DEFAULT
} from 'consts'
import type { RootState } from 'store'
import type {
  MasterBathButtonClickAction,
  MasterBathButtonHoldAction,
  MasterBathButtonReleaseAction,
  MasterBathMotionSensorAction,
  MasterBathTimerAction,
  MasterBathTimerExpireAction
} from 'actions/master'
import type { LightOn, LightOff, Noop } from 'actions/mqttClient'

const DAY_END = '20:30:00'
const DAY_START = '06:45:00'

const isNight = (date: string): boolean => date >= DAY_END || date <= DAY_START

type MotionSensorEpicReturnType = Observable<LightOn | LightOff | Noop>
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
          return of(lightOn(LIGHTS_GROUP, { brightness: BRIGHTNESS_LOW, color: { hex: COLOR_RED_HEX } }))
        }

        return of(lightOn(LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: COLOR_TEMP_NEUTRAL }))
      }

      return of(lightOff(LIGHTS_GROUP))
    }
  })
)

type ButtonHoldEpicReturnType = Observable<LightOn>
const buttonHoldEpic = (
  action$: Observable<MasterBathButtonHoldAction>,
  state$: StateObservable<RootState>
): ButtonHoldEpicReturnType => action$.pipe(
  ofType(MASTER_BATH_BUTTON_HOLD),
  switchMap(() => of(lightOn(LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: COLOR_TEMP_NEUTRAL })))
)

type ButtonReleaseEpicReturnType = Observable<LightOn>
const buttonReleaseEpic = (
  action$: Observable<MasterBathButtonReleaseAction>,
  state$: StateObservable<RootState>
): ButtonReleaseEpicReturnType => action$.pipe(
  ofType(MASTER_BATH_BUTTON_RELEASE),
  switchMap(() => {
    const date = new Date().toLocaleTimeString('en', { hour12: false })

    if (isNight(date)) {
      return of(lightOn(LIGHTS_GROUP, { brightness: BRIGHTNESS_LOW, color: { hex: COLOR_RED_HEX } }))
    }

    return of(lightOn(LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: COLOR_TEMP_NEUTRAL }))
  })
)

type ButtonClickEpicReturnType = Observable<LightOn | MasterBathTimerAction | MasterBathTimerExpireAction | Noop>
const buttonClickEpic = (
  action$: Observable<MasterBathButtonClickAction | MasterBathTimerExpireAction>,
  state$: StateObservable<RootState>
): ButtonClickEpicReturnType => action$.pipe(
  ofType(MASTER_BATH_BUTTON_CLICK),
  switchMap(() => {
    const buttonAction = state$.value.masterReducer.buttonState.action
    const roomState = state$.value.masterReducer.roomState
    if (buttonAction === BUTTON_STATE_SINGLE) {
      if (roomState === ROOM_STATE_DEFAULT) {
        // if default, we need to kill the single click timer
        return of(masterBathTimerExpire())
      }
      // need to turn lights on and start a timer
      return of(
        lightOn(LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: COLOR_TEMP_NEUTRAL }),
        masterBathTimer()
      )
    }

    // we dont handle double click right now
    return of(noop())
  })
)

const masterTimerEpic = (
  action$: Observable<MasterBathTimerAction | MasterBathButtonClickAction>
): Observable<MasterBathTimerExpireAction> => action$.pipe(
  ofType(MASTER_BATH_TIMER),
  switchMap(() => timer(1000 * 60 * 1).pipe(
    map(() => masterBathTimerExpire())
  )),
  takeUntil(action$.pipe(ofType(MASTER_BATH_BUTTON_CLICK)))
)

export default combineEpics(
  buttonClickEpic as any,
  buttonHoldEpic as any,
  buttonReleaseEpic as any,
  motionSensorEpic as any,
  masterTimerEpic as any
)
