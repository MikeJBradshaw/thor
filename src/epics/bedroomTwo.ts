import { combineEpics, ofType } from 'redux-observable'
import { map, switchMap, takeUntil } from 'rxjs/operators'
import { timer } from 'rxjs'
import type { Observable } from 'rxjs'
import type { StateObservable } from 'redux-observable'

import {
  LIGHTS_GROUP,
  UPDATE_BRIGHTNESS,
  UPDATE_PROFILE_BRIGHT,
  UPDATE_PROFILE_RAINBOW,
  UPDATE_PROFILE_SLEEP
} from 'actions/bedroomTwo'
import { lightOn } from 'actions/mqttClient'
import { COLOR_RED_HEX, COLOR_TEMP_NEUTRAL, RAINBOW_COLORS, SECONDS_2, SECONDS_5, SECONDS_6_IN_MSEC } from 'consts'
import type {
  UpdateBrightnessEvent,
  UpdateProfileBrightEvent,
  UpdateProfileRainbowEvent,
  UpdateProfileSleepEvent
} from 'actions/bedroomTwo'
import type { LightOn } from 'actions/mqttClient'
import type { RootState } from 'store'

const changeBrightnessEpic = (
  action$: Observable<UpdateBrightnessEvent>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(UPDATE_BRIGHTNESS),
  map(() => lightOn(LIGHTS_GROUP, { brightness: state$.value.bedroomTwo.brightness }))
)

const profileBrightEpic = (
  action$: Observable<UpdateProfileBrightEvent>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(UPDATE_PROFILE_BRIGHT),
  map(() => lightOn(LIGHTS_GROUP, {
    color_temp: COLOR_TEMP_NEUTRAL,
    brightness: state$.value.bedroomTwo.brightness,
    transition: SECONDS_2
  }))
)

const profileRainbowEpic = (
  action$: Observable<UpdateProfileRainbowEvent | UpdateProfileBrightEvent | UpdateProfileSleepEvent>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(UPDATE_PROFILE_RAINBOW),
  switchMap(() => timer(0, SECONDS_6_IN_MSEC).pipe(
    map(val => lightOn(
      LIGHTS_GROUP,
      {
        brightness: state$.value.bedroomTwo.brightness,
        color: { hex: RAINBOW_COLORS[val % 7] },
        transition: SECONDS_5
      }
    )),
    takeUntil(
      action$.pipe(ofType(UPDATE_PROFILE_BRIGHT, UPDATE_PROFILE_SLEEP))
    )
  ))
)

const profileSleepEpic = (
  action$: Observable<UpdateProfileSleepEvent>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(UPDATE_PROFILE_SLEEP),
  map(() => lightOn(
    LIGHTS_GROUP,
    { color: { hex: COLOR_RED_HEX }, brightness: state$.value.bedroomTwo.brightness, transition: SECONDS_2 }
  ))
)

export default combineEpics(
  changeBrightnessEpic as any,
  profileBrightEpic as any,
  profileRainbowEpic as any,
  profileSleepEpic as any
)
