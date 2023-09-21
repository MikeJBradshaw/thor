import { Observable, concat, of, timer } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import {
  LIVING_ROOM_BUTTON_CLICK,
  LIVING_ROOM_LIGHTS_GROUP,
  LIVING_ROOM_LIGHT_ONE,
  LIVING_ROOM_LIGHT_TWO
} from 'actions/livingRoom'
import { SET_SUNRISE_SUNSET } from 'actions/supervisor'
import { lightOn, lightOff } from 'actions/mqttClient'
import { deltaToTime, deltaToTimeMsec, epochPastmidnight } from 'helpers/helpers'
import { BRIGHTNESS_HIGH, BRIGHTNESS_LOW, COLOR_TEMP_WARM, MINUTES_30_IN_SEC } from 'consts'
import type { LivingRoomButtonClickAction } from 'actions/livingRoom'
import type { LightOn, LightOff } from 'actions/mqttClient'
import type { SetSunriseSunsetAction } from 'actions/supervisor'
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

type DimDownEpicReturnType = Observable<LightOn | LightOff>
const dimDownEpic = (
  action$: Observable<SetSunriseSunsetAction>,
  state$: StateObservable<RootState>
): DimDownEpicReturnType => action$.pipe(
  ofType(SET_SUNRISE_SUNSET),
  // this fires 30 min before sunset to raise the light to full bright
  switchMap(() => timer(deltaToTimeMsec(state$.value.supervisorReducer.sunData.sunset - MINUTES_30_IN_SEC)).pipe(
    switchMap(() => concat(
      of(lightOn(
        LIVING_ROOM_LIGHTS_GROUP,
        { brightness: BRIGHTNESS_HIGH, color_temp: COLOR_TEMP_WARM, transition: MINUTES_30_IN_SEC }
      )),
      // when sunset hits, dim to light 2 over time, kill one light immediately
      timer(deltaToTimeMsec(state$.value.supervisorReducer.sunData.sunset)).pipe(
        switchMap(() => concat(
          of(lightOff(LIVING_ROOM_LIGHT_ONE)),
          of(lightOn(
            LIVING_ROOM_LIGHT_TWO,
            {
              brightness: BRIGHTNESS_LOW,
              transition: deltaToTime(state$.value.supervisorReducer.sunData.civilTwilightEnd) / 1000
            }
          )),
          // kill all lights at 2am
          timer(deltaToTimeMsec(epochPastmidnight({ hours: 2 }))).pipe(
            map(() => lightOff(LIVING_ROOM_LIGHT_TWO))
          )
        ))
      )
    ))
  ))
)

export default combineEpics(
  buttonClickEpic as any,
  dimDownEpic as any
)
