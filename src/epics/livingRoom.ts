import { Observable, concat, of, timer } from 'rxjs'
import { map, switchMap, takeUntil } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import {
  LIVING_ROOM_BUTTON_CLICK,
  LIVING_ROOM_LIGHTS_GROUP,
  LIVING_ROOM_LIGHT_ONE,
  LIVING_ROOM_LIGHT_TWO,
  LIVING_ROOM_TV_POWER,
  UPDATE_PROFILE_DEFAULT,
  UPDATE_PROFILE_RAINBOW,
  updateState,
  updateProfileRainbow
} from 'actions/livingRoom'
import { SET_SUNRISE_SUNSET, HOME_LOW_ENERGY } from 'actions/supervisor'
import { lightOn, lightOff, powerOff, powerOn, noop } from 'actions/mqttClient'
import { stateUpdateSubject } from 'websocket/livingRoomEffects'
import { deltaToTime, deltaToTimeMsec, epochPastmidnight, getCurrentEpoch } from 'helpers/helpers'
import {
  BRIGHTNESS_HIGH,
  BRIGHTNESS_LOW,
  COLOR_TEMP_WARM,
  COLOR_TEMP_NEUTRAL,
  MINUTES_15_IN_SEC,
  MINUTES_30_IN_SEC,
  MINUTES_60_IN_SEC,
  MINUTES_1_IN_MSEC,
  RAINBOW_COLORS,
  SECONDS_1_POINT_5,
  SECONDS_2_IN_MSEC
} from 'consts'
import type {
  LivingRoomButtonClickAction,
  LivingRoomUpdatable,
  UpdateProfileDefaultEvent,
  UpdateProfileRainbowEvent
} from 'actions/livingRoom'
import type { LightOn, LightOff, PowerOff, PowerOn, Noop } from 'actions/mqttClient'
import type { SetSunriseSunsetAction, HomeLowEnergyAction } from 'actions/supervisor'
import type { RootState } from 'store'

type ButtonClickEpicReturnType = Observable<LightOn | UpdateProfileRainbowEvent>
const buttonClickEpic = (
  action$: Observable<LivingRoomButtonClickAction>,
  state$: StateObservable<RootState>
): ButtonClickEpicReturnType => action$.pipe(
  ofType(LIVING_ROOM_BUTTON_CLICK),
  map(() => {
    if (state$.value.livingRoom.isProfileRainbow) { return updateProfileRainbow() }

    else {
      const power = state$.value.livingRoom.lightPower
      return lightOn(
        LIVING_ROOM_LIGHTS_GROUP,
        { brightness: power }
      )
    }
  })
)

type DimDownEpicReturnType = Observable<LightOn | LightOff | Noop>
const dimDownEpic = (
  action$: Observable<SetSunriseSunsetAction>,
  state$: StateObservable<RootState>
): DimDownEpicReturnType => action$.pipe(
  ofType(SET_SUNRISE_SUNSET),
  switchMap(() => {
    const currentEpoch = getCurrentEpoch()
    if (currentEpoch > state$.value.supervisor.sunData.civilTwilightEnd) { return of(noop()) }

    // we are past sunset but before civilTwilightEnd
    if (currentEpoch > state$.value.supervisor.sunData.sunset) {
      return of(
        lightOff(LIVING_ROOM_LIGHT_ONE),
        lightOn(
          LIVING_ROOM_LIGHT_TWO,
          { brightness: 1, transition: deltaToTime(state$.value.supervisor.sunData.civilTwilightEnd) }
        )
      )
    }

    // we are before sunset
    const idealStartTime = state$.value.supervisor.sunData.sunset - MINUTES_60_IN_SEC
    return timer(currentEpoch < idealStartTime ? deltaToTimeMsec(idealStartTime) : 0).pipe(
      switchMap(() => concat(
        of(lightOn(
          LIVING_ROOM_LIGHTS_GROUP,
          {
            brightness: BRIGHTNESS_HIGH,
            color_temp: COLOR_TEMP_WARM,
            transition: deltaToTime(state$.value.supervisor.sunData.sunset - MINUTES_30_IN_SEC)
          }
        )),
        timer(deltaToTimeMsec(state$.value.supervisor.sunData.sunset)).pipe(
          switchMap(() => concat(
            of(lightOff(LIVING_ROOM_LIGHT_ONE, MINUTES_15_IN_SEC)),
            of(lightOn(
              LIVING_ROOM_LIGHT_TWO,
              {
                brightness: BRIGHTNESS_LOW,
                transition: deltaToTime(state$.value.supervisor.sunData.civilTwilightEnd)
              }
            )),
            timer(deltaToTimeMsec(epochPastmidnight({ hours: 2 }))).pipe(map(() => lightOff(LIVING_ROOM_LIGHT_TWO)))
          ))
        )
      ))
    )
  })
)

type LowEnergyEpicReturnType = Observable<LightOff | PowerOff | PowerOn>
const lowEnergyEpic = (action$: Observable<HomeLowEnergyAction>): LowEnergyEpicReturnType => action$.pipe(
  ofType(HOME_LOW_ENERGY),
  switchMap(() => concat(
    of(powerOff(LIVING_ROOM_TV_POWER)),
    of(lightOff(LIVING_ROOM_LIGHTS_GROUP)),
    timer(MINUTES_1_IN_MSEC).pipe(map(() => powerOn(LIVING_ROOM_TV_POWER)))
  ))
)

const profileDefaultEpic = (
  action$: Observable<UpdateProfileDefaultEvent>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(UPDATE_PROFILE_DEFAULT),
  map(() => lightOn(
    LIVING_ROOM_LIGHTS_GROUP,
    { brightness: state$.value.livingRoom.lightPower, color_temp: COLOR_TEMP_NEUTRAL }
  ))
)

const profileRainbowEpic = (
  action$: Observable<UpdateProfileRainbowEvent | UpdateProfileDefaultEvent>,
  state$: StateObservable<RootState>
): Observable<LightOn> => action$.pipe(
  ofType(UPDATE_PROFILE_RAINBOW),
  switchMap(() => timer(0, SECONDS_2_IN_MSEC).pipe(
    map(val => lightOn(
      val % 2 === 0 ? LIVING_ROOM_LIGHT_ONE : LIVING_ROOM_LIGHT_TWO,
      {
        brightness: state$.value.bedroomTwo.brightness,
        color: { hex: RAINBOW_COLORS[val % 7] },
        transition: SECONDS_1_POINT_5
      }
    )),
    takeUntil(
      action$.pipe(ofType(UPDATE_PROFILE_DEFAULT))
    )
  ))
)

const websocketUpdateStateEpic = (action$: Observable<LivingRoomUpdatable>): Observable<Noop> => action$.pipe(
  ofType(
    UPDATE_PROFILE_DEFAULT,
    UPDATE_PROFILE_RAINBOW
  ),
  map(() => {
    stateUpdateSubject.next(updateState())
    return noop()
  })
)

export default combineEpics(
  buttonClickEpic as any,
  dimDownEpic as any,
  lowEnergyEpic as any,
  profileDefaultEpic as any,
  profileRainbowEpic as any,
  websocketUpdateStateEpic as any
)
