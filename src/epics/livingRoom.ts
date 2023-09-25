import { Observable, concat, of, timer } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import {
  LIVING_ROOM_BUTTON_CLICK,
  LIVING_ROOM_LIGHTS_GROUP,
  LIVING_ROOM_LIGHT_ONE,
  LIVING_ROOM_LIGHT_TWO,
  LIVING_ROOM_TV_POWER
} from 'actions/livingRoom'
import { SET_SUNRISE_SUNSET, HOME_LOW_ENERGY } from 'actions/supervisor'
import { lightOn, lightOff, powerOff, powerOn, noop } from 'actions/mqttClient'
import { deltaToTime, deltaToTimeMsec, epochPastmidnight, getCurrentEpoch } from 'helpers/helpers'
import {
  BRIGHTNESS_HIGH,
  BRIGHTNESS_LOW,
  COLOR_TEMP_WARM,
  MINUTES_30_IN_SEC,
  MINUTES_60_IN_SEC,
  MINUTES_1_IN_MSEC
} from 'consts'
import type { LivingRoomButtonClickAction } from 'actions/livingRoom'
import type { LightOn, LightOff, PowerOff, PowerOn, Noop } from 'actions/mqttClient'
import type { SetSunriseSunsetAction, HomeLowEnergyAction } from 'actions/supervisor'
import type { RootState } from 'store'

type ButtonClickEpicReturnType = Observable<LightOn>
const buttonClickEpic = (
  action$: Observable<LivingRoomButtonClickAction>,
  state$: StateObservable<RootState>
): ButtonClickEpicReturnType => action$.pipe(
  ofType(LIVING_ROOM_BUTTON_CLICK),
  map(() => {
    // TODO: what if its night?
    // const buttonAction = state$.value.livingRoomReducer.buttonState.action
    const override = state$.value.livingRoomReducer.overrideLivingRoomLights
    if (override) {
      return lightOn(
        LIVING_ROOM_LIGHTS_GROUP,
        { brightness: BRIGHTNESS_HIGH }
      )
    }

    return lightOn(
      LIVING_ROOM_LIGHTS_GROUP,
      { brightness: BRIGHTNESS_LOW }
    )
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
    if (currentEpoch > state$.value.supervisorReducer.sunData.civilTwilightEnd) { return of(noop()) }

    // we are past sunset but before civilTwilightEnd
    if (currentEpoch > state$.value.supervisorReducer.sunData.sunset) {
      return of(
        lightOff(LIVING_ROOM_LIGHT_ONE),
        lightOn(
          LIVING_ROOM_LIGHT_TWO,
          { brightness: 1, transition: deltaToTime(state$.value.supervisorReducer.sunData.civilTwilightEnd) }
        )
      )
    }

    // we are before sunset
    const idealStartTime = state$.value.supervisorReducer.sunData.sunset - MINUTES_60_IN_SEC
    return timer(currentEpoch < idealStartTime ? deltaToTimeMsec(idealStartTime) : 0).pipe(
      switchMap(() => concat(
        of(lightOn(
          LIVING_ROOM_LIGHTS_GROUP,
          {
            brightness: BRIGHTNESS_HIGH,
            color_temp: COLOR_TEMP_WARM,
            transition: deltaToTime(state$.value.supervisorReducer.sunData.sunset - MINUTES_30_IN_SEC)
          }
        )),
        timer(deltaToTimeMsec(state$.value.supervisorReducer.sunData.sunset)).pipe(
          switchMap(() => concat(
            of(lightOff(LIVING_ROOM_LIGHT_ONE)),
            of(lightOn(
              LIVING_ROOM_LIGHT_TWO,
              {
                brightness: BRIGHTNESS_LOW,
                transition: deltaToTime(state$.value.supervisorReducer.sunData.civilTwilightEnd)
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

export default combineEpics(
  buttonClickEpic as any,
  dimDownEpic as any,
  lowEnergyEpic as any
)
