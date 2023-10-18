import { Observable, of, timer } from 'rxjs'
import { switchMap, map, repeat, takeUntil } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import {
  LIGHTS_GROUP,
  CHANGE_GROUP_RED_LIGHT,
  CHANGE_GROUP_WHITE_LIGHT,
  MASTER_BATH_MOTION_SENSOR,
  UPDATE_BRIGHTNESS,
  UPDATE_MANUAL_PROFILE,
  UPDATE_SENSOR_PROFILE,
  UPDATE_SHOWER_TIMER,
  UPDATE_TIMER_EXPIRE,
  updateBrightness,
  updateTimerExpire,
  updateState
} from 'actions/master'
import { lightOn, lightOff, noop } from 'actions/mqttClient'
import {
  BRIGHTNESS_HIGH,
  BRIGHTNESS_LOW,
  COLOR_TEMP_NEUTRAL,
  COLOR_RED_HEX,
  MINUTES_20_IN_MSEC,
  SECONDS_5
} from 'consts'
import type { RootState } from 'store'
import type {
  ChangeGroupRedLightAction,
  ChangeGroupWhiteLightAction,
  MasterBathMotionSensorAction,
  UpdateBrightnessAction,
  UpdateManualProfileAction,
  UpdateSensorProfileAction,
  UpdateShowerTimerAction,
  UpdateTimerExpireAction
} from 'actions/master'
import { stateUpdateSubject } from 'websocket/masterBathEffects'
import type { LightOn, LightOff, Noop } from 'actions/mqttClient'

const DAY_END = '20:30:00'
const DAY_START = '06:45:00'

const isNight = (date: string): boolean => date >= DAY_END || date <= DAY_START

type MotionSensorEpicReturnType = Observable<LightOn | LightOff | Noop | UpdateBrightnessAction>
const motionSensorEpic = (
  action$: Observable<MasterBathMotionSensorAction>,
  state$: StateObservable<RootState>
): MotionSensorEpicReturnType => action$.pipe(
  ofType(MASTER_BATH_MOTION_SENSOR),
  // broadcast(websocketClient, wsUpdateState),
  switchMap(({ payload: { occupancy } }) => {
    if (state$.value.masterBath.isProfileManual) {
      return of(noop())
    } else {
      if (occupancy) {
        const date = new Date().toLocaleTimeString('en', { hour12: false })

        if (isNight(date)) {
          return of(
            lightOn(LIGHTS_GROUP, { brightness: BRIGHTNESS_LOW, color: { hex: COLOR_RED_HEX } }),
            updateBrightness(BRIGHTNESS_LOW)
          )
        }

        return of(
          lightOn(LIGHTS_GROUP, { brightness: BRIGHTNESS_HIGH, color_temp: COLOR_TEMP_NEUTRAL }),
          updateBrightness(BRIGHTNESS_HIGH)
        )
      }

      return of(lightOff(LIGHTS_GROUP))
    }
  })
)

const timerExpireEpic = (
  action$: Observable<UpdateTimerExpireAction>,
  state$: StateObservable<RootState>
): Observable<LightOff | Noop> => action$.pipe(
  ofType(UPDATE_TIMER_EXPIRE),
  switchMap(() => {
    if (state$.value.masterBath.occupancy) {
      return of(noop())
    }
    return of(lightOff(LIGHTS_GROUP, SECONDS_5))
  })
)

const websocketUpdateBrightnessEpic = (
  action$: Observable<UpdateBrightnessAction>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(UPDATE_BRIGHTNESS),
  map(() => lightOn(LIGHTS_GROUP, { brightness: state$.value.masterBath.brightness }))
)

const websocketChangeRedLightEpic = (
  action$: Observable<ChangeGroupRedLightAction>,
  state$: StateObservable<RootState>
): Observable<LightOn | UpdateBrightnessAction> => action$.pipe(
  ofType(CHANGE_GROUP_RED_LIGHT),
  map(() => lightOn(LIGHTS_GROUP, { brightness: state$.value.masterBath.brightness, color: { hex: COLOR_RED_HEX } }))
)

const websocketChangeWhiteLightEpic = (
  action$: Observable<ChangeGroupWhiteLightAction>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(CHANGE_GROUP_WHITE_LIGHT),
  map(() => lightOn(LIGHTS_GROUP, { brightness: state$.value.masterBath.brightness, color_temp: COLOR_TEMP_NEUTRAL }))
)

const websocketShowerTimerEpic = (
  action$: Observable<UpdateShowerTimerAction | UpdateSensorProfileAction>
): Observable<UpdateTimerExpireAction> => action$.pipe(
  ofType(UPDATE_SHOWER_TIMER),
  switchMap(() => timer(MINUTES_20_IN_MSEC).pipe(map(() => updateTimerExpire()))),
  takeUntil(action$.pipe(ofType(UPDATE_SENSOR_PROFILE))),
  repeat()
)

type StateUpdateAction = ChangeGroupRedLightAction
| ChangeGroupWhiteLightAction
| UpdateBrightnessAction
| UpdateManualProfileAction
| UpdateSensorProfileAction
| UpdateShowerTimerAction
| UpdateTimerExpireAction
const websocketUpdateStateEpic = (action$: Observable<StateUpdateAction>): Observable<Noop> => action$.pipe(
  ofType(
    CHANGE_GROUP_RED_LIGHT,
    CHANGE_GROUP_WHITE_LIGHT,
    UPDATE_BRIGHTNESS,
    UPDATE_MANUAL_PROFILE,
    UPDATE_SENSOR_PROFILE,
    UPDATE_SHOWER_TIMER,
    UPDATE_TIMER_EXPIRE
  ),
  map(() => {
    stateUpdateSubject.next(updateState())
    return noop()
  })
)

export default combineEpics(
  motionSensorEpic as any,
  timerExpireEpic as any,
  websocketUpdateBrightnessEpic as any,
  websocketChangeRedLightEpic as any,
  websocketChangeWhiteLightEpic as any,
  websocketShowerTimerEpic as any,
  websocketUpdateStateEpic as any
)
