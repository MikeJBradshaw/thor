import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import { BEDROOM_ONE_LIGHTS_GROUP, BEDROOM_ONE_POWER_ONE, BEDROOM_ONE_BUTTON_CLICK } from 'actions/bedroomOne'
import { lightOnPublish, noop, powerOn, powerOff } from 'actions/mqttClient'
import { ROOM_STATE_DOUBLE, ROOM_STATE_SINGLE } from 'consts'
import type { RootState } from 'store'
import type { BedroomOneButtonClickAction } from 'actions/bedroomOne'
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

export default combineEpics(buttonClickEpic as any)
