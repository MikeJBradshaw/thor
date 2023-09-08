import { Observable, of, timer } from 'rxjs'
import { switchMap, takeUntil, map } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import {
  BEDROOM_ONE_BUTTON_CLICK,
  BEDROOM_ONE_BUTTON_HOLD,
  BEDROOM_ONE_BUTTON_RELEASE,
  BEDROOM_ONE_LIGHTS_GROUP,
  BEDROOM_ONE_POWER_ONE,
  BEDROOM_ONE_LIGHT_1,
  BEDROOM_ONE_LIGHT_2
} from 'actions/bedroomOne'
import { lightOnPublish, noop, powerOn, powerOff } from 'actions/mqttClient'
import { ROOM_STATE_DOUBLE, ROOM_STATE_SINGLE, RAINBOW_COLORS } from 'consts'
import type { RootState } from 'store'
import type {
  BedroomOneButtonClickAction,
  BedroomOneButtonHoldAction,
  BedroomOneButtonReleaseAction
} from 'actions/bedroomOne'
import type { LightOnPublish, Noop, PowerOn, PowerOff } from 'actions/mqttClient'

type ButtonClickedEpicReturnType = Observable<LightOnPublish | Noop | PowerOn | PowerOff>
const buttonClickEpic = (
  action$: Observable<BedroomOneButtonClickAction>,
  state$: StateObservable<RootState>
): ButtonClickedEpicReturnType => action$.pipe(
  ofType(BEDROOM_ONE_BUTTON_CLICK),
  switchMap(({ payload: { action } }) => {
    const currentRoomSetup = state$.value.bedroomOneReducer.roomSetup
    const override = state$.value.bedroomOneReducer.overrideLights
    if (override) {
      of(noop())
    }

    if (currentRoomSetup === ROOM_STATE_DOUBLE) {
      const stateType = state$.value.bedroomOneReducer.doubleClickState.type
      const colorPackage = (stateType === 'color-light')
        ? { color: { hex: state$.value.bedroomOneReducer.doubleClickState.values.color } }
        : { color_temp: state$.value.bedroomOneReducer.doubleClickState.values.colorTemp }

      return of(
        lightOnPublish(
          BEDROOM_ONE_LIGHTS_GROUP,
          {
            brightness: state$.value.bedroomOneReducer.doubleClickState.values.brightness,
            ...colorPackage
          }
        ),
        powerOff(BEDROOM_ONE_POWER_ONE, { state: 'OFF', power_on_behavior: 'on' })
      )
    }

    if (currentRoomSetup === ROOM_STATE_SINGLE) {
      const stateType = state$.value.bedroomOneReducer.singleClickState.type
      const colorPackage = (stateType === 'color-light')
        ? { color: { hex: state$.value.bedroomOneReducer.singleClickState.values.color } }
        : { color_temp: state$.value.bedroomOneReducer.singleClickState.values.colorTemp }

      return of(
        lightOnPublish(
          BEDROOM_ONE_LIGHTS_GROUP,
          {
            brightness: state$.value.bedroomOneReducer.singleClickState.values.brightness,
            ...colorPackage
          }
        ),
        powerOn(BEDROOM_ONE_POWER_ONE, { state: 'ON' })
      )
    }

    const stateType = state$.value.bedroomOneReducer.defaultState.type
    const colorPackage = (stateType === 'color-light')
      ? { color: { hex: state$.value.bedroomOneReducer.defaultState.values.color } }
      : { color_temp: state$.value.bedroomOneReducer.defaultState.values.colorTemp }
    const brightness = state$.value.bedroomOneReducer.defaultState.values.brightness

    return of(
      lightOnPublish(BEDROOM_ONE_LIGHTS_GROUP, { brightness, ...colorPackage }),
      powerOff(BEDROOM_ONE_POWER_ONE, { state: 'OFF', power_on_behavior: 'on' })
    )
  })
)

type ButtonHoldEpicReturnType = Observable<LightOnPublish>
const buttonHoldEpic = (
  action$: Observable<BedroomOneButtonHoldAction | BedroomOneButtonReleaseAction>
): ButtonHoldEpicReturnType => action$.pipe(
  ofType(BEDROOM_ONE_BUTTON_HOLD),
  switchMap(() => timer(0, 250).pipe(
    takeUntil(BEDROOM_ONE_BUTTON_RELEASE),
    map((val: number) => {
      if (val % 2 === 0) {
        return lightOnPublish(BEDROOM_ONE_LIGHT_1, { brightness: 255, color: { hex: RAINBOW_COLORS[val % 7] } })
      }
      return lightOnPublish(BEDROOM_ONE_LIGHT_2, { brightness: 255, color: { hex: RAINBOW_COLORS[val % 7] } })
    })
  ))
)

type ButtonReleaseEpicReturnType = Observable<LightOnPublish | PowerOn | PowerOff>
export const buttonReleaseEpic = (
  action$: Observable<BedroomOneButtonReleaseAction>,
  state$: StateObservable<RootState>
): ButtonReleaseEpicReturnType => action$.pipe(
  ofType(BEDROOM_ONE_BUTTON_RELEASE),
  switchMap(() => {
    const currentRoomSetup = state$.value.bedroomOneReducer.roomSetup
    if (currentRoomSetup === ROOM_STATE_DOUBLE) {
      const stateType = state$.value.bedroomOneReducer.doubleClickState.type
      const colorPackage = (stateType === 'color-light')
        ? { color: { hex: state$.value.bedroomOneReducer.doubleClickState.values.color } }
        : { color_temp: state$.value.bedroomOneReducer.doubleClickState.values.colorTemp }

      return of(
        lightOnPublish(
          BEDROOM_ONE_LIGHTS_GROUP,
          {
            brightness: state$.value.bedroomOneReducer.doubleClickState.values.brightness,
            ...colorPackage
          }
        ),
        powerOff(BEDROOM_ONE_POWER_ONE, { state: 'OFF', power_on_behavior: 'on' })
      )
    }

    if (currentRoomSetup === ROOM_STATE_SINGLE) {
      const stateType = state$.value.bedroomOneReducer.singleClickState.type
      const colorPackage = (stateType === 'color-light')
        ? { color: { hex: state$.value.bedroomOneReducer.singleClickState.values.color } }
        : { color_temp: state$.value.bedroomOneReducer.singleClickState.values.colorTemp }

      return of(
        lightOnPublish(
          BEDROOM_ONE_LIGHTS_GROUP,
          {
            brightness: state$.value.bedroomOneReducer.singleClickState.values.brightness,
            ...colorPackage
          }
        ),
        powerOn(BEDROOM_ONE_POWER_ONE, { state: 'ON' })
      )
    }

    const stateType = state$.value.bedroomOneReducer.defaultState.type
    const colorPackage = (stateType === 'color-light')
      ? { color: { hex: state$.value.bedroomOneReducer.defaultState.values.color } }
      : { color_temp: state$.value.bedroomOneReducer.defaultState.values.colorTemp }
    const brightness = state$.value.bedroomOneReducer.defaultState.values.brightness

    return of(
      lightOnPublish(BEDROOM_ONE_LIGHTS_GROUP, { brightness, ...colorPackage }),
      powerOff(BEDROOM_ONE_POWER_ONE, { state: 'OFF', power_on_behavior: 'on' })
    )
  })
)

export default combineEpics(buttonClickEpic as any, buttonHoldEpic as any)
