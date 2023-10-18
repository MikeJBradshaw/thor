import { Observable, concat, of, timer } from 'rxjs'
import { switchMap, takeUntil, map } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import {
  BEDROOM_ONE_LIGHTS_GROUP,
  // BEDROOM_ONE_LIGHT_1,
  BEDROOM_ONE_POWER_ONE,
  UPDATE_BRIGHTNESS,
  // UPDATE_OCCUPANCY,
  UPDATE_PROFILE_BRIGHT,
  UPDATE_PROFILE_COLORS,
  UPDATE_PROFILE_DEFAULT,
  UPDATE_PROFILE_RED,
  UPDATE_PROFILE_SLEEP,
  updateState
} from 'actions/bedroomOne'
import { lightOn, lightOff, noop, powerOn, powerOff } from 'actions/mqttClient'
import {
  // BRIGHTNESS_1,
  COLOR_HOT_PINK,
  COLOR_RED_HEX,
  COLOR_TEMP_NEUTRAL,
  RAINBOW_COLORS,
  SECONDS_6_IN_MSEC,
  SECONDS_2,
  SECONDS_5
} from 'consts'
import type { RootState } from 'store'
import type {
  UpdateBrightnessEvent,
  // UpdateOccupancyAction,
  UpdateProfileBrightEvent,
  UpdateProfileColorsEvent,
  UpdateProfileDefaultEvent,
  UpdateProfileRedEvent,
  UpdateProfileSleepEvent
} from 'actions/bedroomOne'
import { bedroomOneStateSubject } from 'websocket/bedroomOneEffects'
import type { LightOn, LightOff, Noop, PowerOn, PowerOff } from 'actions/mqttClient'

const profileBrightEpic = (
  action$: Observable<UpdateProfileBrightEvent>,
  state$: StateObservable<RootState>
): Observable<LightOn | PowerOn | PowerOff> => action$.pipe(
  ofType(UPDATE_PROFILE_BRIGHT),
  switchMap(() => concat(
    of(
      lightOn(
        BEDROOM_ONE_LIGHTS_GROUP,
        { brightness: state$.value.bedroomOne.brightness, color_temp: COLOR_TEMP_NEUTRAL }
      )
    ),
    of(powerOff(BEDROOM_ONE_POWER_ONE)),
    timer(1000).pipe(map(() => powerOn(BEDROOM_ONE_POWER_ONE)))
  ))
)

type StopColorsAction = UpdateProfileBrightEvent
| UpdateProfileDefaultEvent
| UpdateProfileRedEvent
| UpdateProfileSleepEvent
const profileColorsEpic = (
  action$: Observable<UpdateProfileColorsEvent | StopColorsAction>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(UPDATE_PROFILE_COLORS),
  switchMap(() => timer(0, SECONDS_6_IN_MSEC).pipe(
    map(val => lightOn(
      BEDROOM_ONE_LIGHTS_GROUP,
      {
        brightness: state$.value.bedroomOne.brightness,
        color: { hex: RAINBOW_COLORS[val % 7] },
        transition: SECONDS_5
      }
    )),
    takeUntil(
      action$.pipe(ofType(UPDATE_PROFILE_BRIGHT, UPDATE_PROFILE_DEFAULT, UPDATE_PROFILE_RED, UPDATE_PROFILE_SLEEP))
    )
  ))
)

const profileDefaultEpic = (
  action$: Observable<UpdateProfileDefaultEvent>,
  state$: StateObservable<RootState>
): Observable<LightOn | PowerOff | PowerOn> => action$.pipe(
  ofType(UPDATE_PROFILE_DEFAULT),
  switchMap(() => concat(
    of(
      lightOn(
        BEDROOM_ONE_LIGHTS_GROUP,
        { brightness: state$.value.bedroomOne.brightness, color: { hex: COLOR_HOT_PINK }, transition: SECONDS_2 }
      )
    ),
    of(powerOff(BEDROOM_ONE_POWER_ONE)),
    timer(1000).pipe(map(() => powerOn(BEDROOM_ONE_POWER_ONE)))
  ))
)

const profileRedEpic = (
  action$: Observable<UpdateProfileRedEvent>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(UPDATE_PROFILE_RED),
  map(() => lightOn(
    BEDROOM_ONE_LIGHTS_GROUP,
    { brightness: state$.value.bedroomOne.brightness, color: { hex: COLOR_RED_HEX } }
  ))
)

const profileSleepEpic = (action$: Observable<UpdateProfileSleepEvent>): Observable<LightOff | PowerOn> => action$.pipe(
  ofType(UPDATE_PROFILE_SLEEP),
  switchMap(() => concat(
    of(lightOff(BEDROOM_ONE_LIGHTS_GROUP)),
    of(powerOn(BEDROOM_ONE_POWER_ONE))
  ))
)

// const redLightNightLightEpic = (
//   action$: Observable<UpdateOccupancyAction>
// ): Observable<LightOn> => action$.pipe(
//   ofType(UPDATE_OCCUPANCY),
//   map(() => lightOn(BEDROOM_ONE_LIGHT_1, { brightness: BRIGHTNESS_1, color: { hex: COLOR_RED_HEX } })),
//   takeUntil(
//     action$.pipe(
//       ofType(UPDATE_OCCUPANCY_FALSE)
//     )
//   )
// )
type UpdateStateActions = UpdateBrightnessEvent
| UpdateProfileBrightEvent
| UpdateProfileColorsEvent
| UpdateProfileDefaultEvent
| UpdateProfileRedEvent
| UpdateProfileSleepEvent
const updateStateEpic = (action$: Observable<UpdateStateActions>): Observable<Noop> => action$.pipe(
  ofType(
    UPDATE_BRIGHTNESS,
    UPDATE_PROFILE_BRIGHT,
    UPDATE_PROFILE_COLORS,
    UPDATE_PROFILE_DEFAULT,
    UPDATE_PROFILE_RED,
    UPDATE_PROFILE_SLEEP
  ),
  map(() => {
    bedroomOneStateSubject.next(updateState())
    return noop()
  })
)

export default combineEpics(
  profileBrightEpic as any,
  profileColorsEpic as any,
  profileDefaultEpic as any,
  profileRedEpic as any,
  profileSleepEpic as any,
  updateStateEpic as any
  // redLightNightLightEpic as any
)
