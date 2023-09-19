import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { combineEpics, ofType, StateObservable } from 'redux-observable'

import {
  LIVING_ROOM_BUTTON_CLICK,
  LIVING_ROOM_LIGHTS_GROUP
} from 'actions/livingRoom'
import { lightOnPublish } from 'actions/mqttClient'
import type { LivingRoomButtonClickAction } from 'actions/livingRoom'
import type { LightOnPublish } from 'actions/mqttClient'
import type { RootState } from 'store'

type ButtonClickEpicReturnType = Observable<LightOnPublish>
const buttonClickEpic = (
  action$: Observable<LivingRoomButtonClickAction>,
  state$: StateObservable<RootState>
): ButtonClickEpicReturnType => action$.pipe(
  ofType(LIVING_ROOM_BUTTON_CLICK),
  map(() => {
    // const buttonAction = state$.value.livingRoomReducer.buttonState.action
    const override = state$.value.livingRoomReducer.overrideLivingRoomLights
    if (override) {
      return lightOnPublish(
        LIVING_ROOM_LIGHTS_GROUP,
        { brightness: 255 }
      )
    }
    return lightOnPublish(
      LIVING_ROOM_LIGHTS_GROUP,
      { brightness: 1 }
    )
  })
)

export default combineEpics(
  buttonClickEpic as any
)
