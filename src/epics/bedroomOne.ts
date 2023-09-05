import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import { BEDROOM_ONE_LIGHTS, BUTTON_CLICK } from 'actions/bedroomOne'
import { lightOnPublish, noop } from 'actions/mqttPublishClient'
import { ButtonState } from 'payloads'
import type { RootState } from 'store'
import type { ButtonClickAction } from 'actions/bedroomOne'
import type { LightOnPublish, Noop } from 'actions/mqttPublishClient'

type ButtonClickedEpicReturnType = Observable<LightOnPublish | Noop>
const buttonClickEpic = (
  action$: Observable<ButtonClickAction>,
  state$: StateObservable<RootState>
): ButtonClickedEpicReturnType => action$.pipe(
  ofType(BUTTON_CLICK),
  switchMap(({ state }) => {
    const currentButtonState = state$.value.bedroomOneReducer.buttonState
    const override = state$.value.bedroomOneReducer.overrideLights
    if (override) {
      of(noop())
    }

    if (currentButtonState === ButtonState.Double) {
      const stateType = state$.value.bedroomOneReducer.doubleClickState.type
      const colorPackage = (stateType === 'color-light')
        ? { color: { hex: state$.value.bedroomOneReducer.doubleClickState.values.color } }
        : { color_temp: state$.value.bedroomOneReducer.doubleClickState.values.colorTemp }

      return of(
        lightOnPublish(
          BEDROOM_ONE_LIGHTS[0],
          {
            brightness: state$.value.bedroomOneReducer.doubleClickState.values.brightness,
            ...colorPackage
          }
        ),
        lightOnPublish(
          BEDROOM_ONE_LIGHTS[1],
          {
            brightness: state$.value.bedroomOneReducer.doubleClickState.values.brightness,
            ...colorPackage
          }
        )
      )
    }

    if (currentButtonState === ButtonState.Single) {
      const stateType = state$.value.bedroomOneReducer.singleClickState.type
      const colorPackage = (stateType === 'color-light')
        ? { color: { hex: state$.value.bedroomOneReducer.singleClickState.values.color } }
        : { color_temp: state$.value.bedroomOneReducer.singleClickState.values.colorTemp }

      return of(
        lightOnPublish(
          BEDROOM_ONE_LIGHTS[0],
          {
            brightness: state$.value.bedroomOneReducer.singleClickState.values.brightness,
            ...colorPackage
          }
        ),
        lightOnPublish(
          BEDROOM_ONE_LIGHTS[1],
          {
            brightness: state$.value.bedroomOneReducer.singleClickState.values.brightness,
            ...colorPackage
          }
        )
      )
    }

    const stateType = state$.value.bedroomOneReducer.defaultState.type
    const colorPackage = (stateType === 'color-light')
      ? { color: { hex: state$.value.bedroomOneReducer.defaultState.values.color } }
      : { color_temp: state$.value.bedroomOneReducer.defaultState.values.colorTemp }
    const brightness = state$.value.bedroomOneReducer.defaultState.values.brightness

    return of(
      lightOnPublish(BEDROOM_ONE_LIGHTS[0], { brightness, ...colorPackage }),
      lightOnPublish(BEDROOM_ONE_LIGHTS[1], { brightness, ...colorPackage })
    )
  })
)

export default combineEpics(buttonClickEpic as any)
